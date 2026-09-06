"""FastAPI contract tests for the production Document Engine routes."""

from pathlib import Path
import sys

import pytest
from fastapi.testclient import TestClient

DOCGEN_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(DOCGEN_DIR))

import api  # noqa: E402
import classifier.classify as classifier  # noqa: E402


client = TestClient(api.app)


def test_templates_endpoint_returns_real_catalogue():
    response = client.get("/api/templates")
    assert response.status_code == 200
    templates = response.json()
    assert isinstance(templates, list)
    assert {item["id"] for item in templates} == {
        "Onboarding_Letter", "NDA", "Offer_Letter", "Contract", "MOU", "IP_Agreement"
    }
    for item in templates:
        assert isinstance(item["name"], str) and item["name"]
        assert isinstance(item["required_fields"], list)
        assert isinstance(item["optional_fields"], list)


def test_schema_endpoint_returns_field_schema():
    response = client.get("/api/schema/NDA")
    assert response.status_code == 200
    body = response.json()
    assert body["doc_type"] == "NDA"
    assert {field["key"] for field in body["required"]} == {
        "Name", "Company", "Date", "Term", "Jurisdiction"
    }


def test_unknown_template_is_controlled_error():
    response = client.post("/api/generate", json={"doc_type": "Not_A_Template", "fields": {}})
    assert response.status_code == 400
    body = response.json()
    assert body["success"] is False
    assert "Unsupported document type" in body["error"]


def test_missing_required_fields_are_rejected_before_rendering():
    response = client.post("/api/generate", json={"doc_type": "NDA", "fields": {}})
    assert response.status_code == 400
    assert response.json()["success"] is False
    assert "Missing required fields" in response.json()["error"]


def test_gemini_configuration_failure_is_explicit(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setattr(classifier, "GEMINI_API_KEY", None)
    monkeypatch.setattr(classifier, "_client", None)
    with pytest.raises(RuntimeError, match="GEMINI_API_KEY is not set"):
        classifier._get_client()


# ---------------------------------------------------------------------------
# Health / reachability
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("path", ["/health", "/api/health"])
def test_health_is_reachable_under_both_prefixes(path: str):
    # The Next.js frontend only proxies /api/*, so /api/health must exist or
    # the browser has to download the whole catalogue to test reachability.
    response = client.get(path)
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


# ---------------------------------------------------------------------------
# Caching
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("path", ["/api/templates", "/api/schema/NDA"])
def test_catalogue_endpoints_are_cacheable(path: str):
    response = client.get(path)
    assert response.status_code == 200
    assert "max-age" in response.headers.get("cache-control", "")


# ---------------------------------------------------------------------------
# Path traversal — doc_id and filenames reach the filesystem
# ---------------------------------------------------------------------------

@pytest.mark.parametrize(
    "doc_id",
    ["../../app", "..%2F..%2Fschema", "not-a-doc-id", "", "a" * 13, "ZZZZZZZZZZZZ"],
)
def test_preview_rejects_non_generated_doc_ids(doc_id: str):
    response = client.get(f"/api/preview/{doc_id}")
    assert response.status_code in (400, 404)
    if response.status_code == 400:
        assert response.json()["success"] is False


def test_sign_rejects_traversal_doc_id():
    response = client.post(
        "/api/sign",
        data={"doc_id": "../../app", "cert_password": "x", "signer_name": "y"},
        files={"cert_file": ("c.pfx", b"not-a-cert")},
    )
    assert response.status_code == 400
    assert "Malformed document id" in response.json()["error"]


@pytest.mark.parametrize(
    "filename",
    ["../../../etc/passwd", "..\\..\\windows\\system32", "..", "", "a/b/c.pdf"],
)
def test_upload_filenames_are_reduced_to_safe_basenames(filename: str):
    safe = api._sanitize_upload_name(filename, "fallback")
    assert "/" not in safe and "\\" not in safe
    assert safe not in {"", ".", ".."}


# ---------------------------------------------------------------------------
# /files must publish only finished PDFs
# ---------------------------------------------------------------------------

@pytest.mark.parametrize(
    "filename",
    [
        "output.log",          # XeLaTeX log
        "output.aux",          # XeLaTeX aux
        "abcdef123456.tex",    # rendered source: contains every field value
        "Montserrat-Bold.ttf", # bundled font
        "../schema.py",        # traversal
    ],
)
def test_files_route_serves_pdfs_only(filename: str):
    response = client.get(f"/files/{filename}")
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# Frontend contract: "not found" is an answer, not a transport failure
# ---------------------------------------------------------------------------

def test_preview_of_missing_document_is_a_successful_negative():
    response = client.get("/api/preview/aaaaaaaaaaaa")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["exists"] is False


# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------

def test_localhost_origin_with_port_is_allowed():
    # The origin regex previously used \\d inside a raw string, so no
    # localhost origin carrying a port ever matched.
    response = client.get(
        "/api/health", headers={"Origin": "http://localhost:4321"}
    )
    assert response.headers.get("access-control-allow-origin") == "http://localhost:4321"


# ---------------------------------------------------------------------------
# LaTeX escaping — these inputs previously aborted the XeLaTeX run
# ---------------------------------------------------------------------------

@pytest.mark.parametrize(
    "raw,expected",
    [
        ("A&B", r"A\&B"),
        ("100% owned", r"100\% owned"),
        ("Legal_Services", r"Legal\_Services"),
        ("#1 Pvt Ltd", r"\#1 Pvt Ltd"),
        ("Cost $5", r"Cost \$5"),
        ("Line one\\\\Line two", "Line one\\\\Line two"),  # manual break preserved
    ],
)
def test_company_profile_values_are_escaped_for_latex(raw: str, expected: str):
    from utils.latex_writer import _escape_latex_light
    assert _escape_latex_light(raw) == expected


def test_unfilled_optional_tokens_with_digits_are_cleared():
    import re as _re
    # The residual-token regex must cover keys containing digits, e.g.
    # {{PartyA_Name}} / {{Party2}}, or the raw token is typeset into the PDF.
    cleaned = _re.sub(r"\{\{[A-Za-z0-9_]+\}\}", "", "x {{Party2}} y {{PartyA_Name}} z")
    assert "{{" not in cleaned
