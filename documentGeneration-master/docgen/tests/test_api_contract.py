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
