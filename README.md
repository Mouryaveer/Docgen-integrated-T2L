# Turn2Law — Full-Stack Legal Document Platform

Turn2Law is a two-service platform for drafting, branding, previewing, digitally signing, and downloading professional Indian-jurisdiction legal documents. A Next.js frontend communicates through API rewrites to a FastAPI backend that drives XeLaTeX compilation, a multi-tenant branding engine, Google Gemini classification, and PKCS#12 digital signatures.

---

## Repository layout

```
Turn2Law/Main/
├── T2L-site-main/                  ← Next.js 16 frontend  (port 3000)
└── documentGeneration-master/      ← FastAPI + Python backend  (port 8000)
    └── docgen/                     ← Entire Python package lives here
```

Both services must run simultaneously. The frontend proxies all `/api/*` and `/files/*` requests to `localhost:8000`, so from the browser's perspective everything is same-origin with no CORS friction.

---

## Prerequisites

| Requirement | Notes |
|---|---|
| **Node.js 18+** | For the Next.js frontend |
| **Python 3.11+** | Tested on 3.11, 3.12, 3.14 |
| **MiKTeX** (Windows) or **TeX Live** (Linux/macOS) | Must include `xelatex` on PATH |
| **Tesseract OCR** binary | Only required for image → text classification |
| **Google Gemini API key** | Free tier at [aistudio.google.com](https://aistudio.google.com) |

---

## Quick start

### 1 — Clone and set up the Python virtual environment

```powershell
cd documentGeneration-master

python -m venv .venv
.venv\Scripts\Activate.ps1

pip install -r docgen\requirements.txt
```

### 2 — Create the backend environment file

```
# documentGeneration-master/docgen/.env
GEMINI_API_KEY=your_key_here
```

Without this key the AI classification step fails. Direct form-based generation works fine without it.

### 3 — Install frontend dependencies

```powershell
cd T2L-site-main
npm install
```

### 4 — Start both services

Run everything with the single launcher script at the repo root:

```powershell
# From Turn2Law\Main\
start-docgen.bat
```

Or start each service manually in separate terminals:

```powershell
# Terminal 1 — FastAPI backend
cd documentGeneration-master\docgen
..\.venv\Scripts\python -m uvicorn api:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2 — Next.js frontend
cd T2L-site-main
npm run dev -- --hostname 127.0.0.1 --port 3000
```

### 5 — Open the app

| URL | Purpose |
|---|---|
| `http://127.0.0.1:3000` | Main site and dashboard |
| `http://127.0.0.1:3000/dashboard` | Document command center |
| `http://127.0.0.1:3000/docengine` | Standalone 9-step document wizard |
| `http://127.0.0.1:8000/docs` | FastAPI Swagger UI |

---

## Architecture overview

```
Browser (localhost:3000)
        │
        │  HTTP via Next.js rewrites
        ▼
┌───────────────────────────────────┐
│  Next.js 16  (T2L-site-main)      │
│  React 19 · Tailwind 4 · Zustand  │
│                                   │
│  /api/docengine/*  ──────────────►│
│  /api/*            ──────────────►│──► localhost:8000/api/*
│  /files/*          ──────────────►│──► localhost:8000/files/*
└───────────────────────────────────┘
                                     │
                    ┌────────────────▼──────────────────────┐
                    │  FastAPI  (documentGeneration-master)  │
                    │  Uvicorn · Python 3.11+                │
                    │                                        │
                    │  Document pipeline  ── XeLaTeX (2-pass)│
                    │  Branding engine    ── Pillow / TikZ   │
                    │  Classifier         ── Gemini Flash    │
                    │  Digital signature  ── pyHanko / CMS   │
                    └────────────────────────────────────────┘
```

### How the proxy works

`next.config.ts` defines three rewrite rules:

```ts
{ source: "/api/docengine/:path*", destination: "http://localhost:8000/api/:path*" },
{ source: "/api/:path*",           destination: "http://localhost:8000/api/:path*" },
{ source: "/files/:path*",         destination: "http://localhost:8000/files/:path*" },
```

The service layer (`app/services/docengine.ts`) calls `/api/docengine/…` — the double segment is just a namespacing convention; it collapses to `/api/…` on the backend.

---

## Frontend — T2L-site-main

### Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI library | React 19 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 with `localStorage` persistence |
| HTTP | Axios 1.19 |
| Language | TypeScript |

### Pages

```
/                                   Landing page
/docengine                          Public 9-step document wizard (standalone)
/legal-services                     Legal services listing
/resources                          Resource hub — news, case law, courses
/introspector                       Document introspector tool

/dashboard                          Overview — stats + document table
/dashboard/documents                My Documents
/dashboard/doc-engine/history       Version history
/dashboard/doc-engine/templates     Template catalogue
/dashboard/doc-engine/branding      Branding profiles library
/dashboard/doc-engine/signatures    Digital certificate metadata
/dashboard/doc-engine/create        → redirects to /docengine
/dashboard/doc-engine/preview       → redirects to /docengine
/dashboard/doc-engine/sign          → redirects to /docengine
```

### Application state

Zustand store (`app/store/documentStore.ts`) manages two tiers:

**Persisted to `localStorage` under `t2l-documents`:**
- `documents[]` — every generated document record with its version history
- `brandingProfiles[]` — company branding configurations
- `certificates[]` — validated certificate metadata (never the private key or password)

**In-memory only (resets on page reload):**
- `gen` — the live wizard state (step, form data, uploaded files, generation status)

### Authentication

Mock-only. `AuthContext` stores a user object in `localStorage` under `t2l_session`. On first load the demo user is auto-logged in (`mourya@turn2law.in`, plan: pro). Swap `loginUser` / `logoutUser` in `AuthContext.tsx` to wire in a real backend.

### Key source files

```
app/
├── page.tsx                        ← Landing page
├── layout.tsx                      ← Root layout (fonts, global styles)
├── dashboard/
│   ├── layout.tsx                  ← Dashboard shell (sidebar + topbar)
│   └── page.tsx                    ← Overview view
├── docengine/
│   └── page.tsx                    ← Public wizard route
├── components/
│   ├── DocEngineStandalone/
│   │   └── DocEngineStandaloneApp.tsx   ← Public-facing 9-step wizard
│   └── DashboardDocEngine/
│       └── DocEngineWorkspace.tsx       ← Dashboard workspace (all views)
├── services/
│   └── docengine.ts                ← All API calls (never call fetch directly)
├── store/
│   └── documentStore.ts            ← Zustand store
├── types/
│   └── docengine.ts                ← All shared TypeScript types
└── context/
    └── AuthContext.tsx             ← Mock auth
```

---

## The 9-step document wizard

Both the public `/docengine` page and the dashboard use the same wizard flow, driven by the same service layer and Zustand store.

| Step | What happens | API call |
|------|-------------|----------|
| 1 | Select document type from template grid | `GET /api/templates` on load |
| 2 | Choose input method — Form, PDF, DOCX, or Image | `POST /api/classify` on file upload |
| 3 | Fill form fields (required + optional) | `GET /api/schema/{doc_type}` on step entry |
| 4 | Configure branding — Turn2Law / Letterhead / Advanced | — (uploads collected client-side) |
| 5 | Review all inputs | — |
| 6 | Generate PDF (auto-triggered on step entry) | `POST /api/generate*` |
| 7 | Preview PDF in-browser iframe | `/files/{docId}.pdf` |
| 8 | Validate certificate → sign PDF | `POST /api/validate-cert` → `POST /api/sign` |
| 9 | Download unsigned and/or signed PDF | `/files/{docId}.pdf` |

Draft data is auto-saved to `localStorage` on every keystroke and restored when returning to the same document type.

---

## Backend — documentGeneration-master

### Tech stack

| Layer | Package | Version |
|---|---|---|
| Web framework | FastAPI + Uvicorn | latest |
| AI classification | Google Gemini 2.5 Flash (`google-genai`) | — |
| PDF compilation | XeLaTeX (MiKTeX / TeX Live) | — |
| PDF signing | pyHanko | 0.25.1 |
| Certificate handling | cryptography | 43.0.3 |
| Certificate validation | pyhanko-certvalidator | 0.26.4 |
| Image processing | Pillow | latest |
| PDF extraction | PyMuPDF | latest |
| DOCX extraction | python-docx | latest |
| OCR | pytesseract + Tesseract 5+ | — |
| Fonts (in PDF) | Montserrat + Garet TTF (via XeLaTeX fontspec) | — |

### Project structure

```
documentGeneration-master/
├── docgen/
│   ├── api.py                      ← FastAPI app — all endpoints + static mounts
│   ├── app.py                      ← Core Python library (importable, no HTTP)
│   ├── schema.py                   ← Required/optional field lists per doc type
│   ├── config.py                   ← Loads GEMINI_API_KEY from .env
│   │
│   ├── classifier/
│   │   └── classify.py             ← Gemini 2.5 Flash: text → doc type label + retry
│   │
│   ├── extractors/
│   │   ├── pdf_extractor.py        ← PyMuPDF
│   │   ├── docx_extractor.py       ← python-docx
│   │   └── image_extractor.py      ← pytesseract OCR
│   │
│   ├── branding/
│   │   ├── branding_engine.py      ← Orchestrator: turn2law / custom / letterhead
│   │   ├── complete_letterhead.py  ← Full-page A4 PNG background mode
│   │   ├── layout_builder.py       ← px→pt margins + XeLaTeX preamble generation
│   │   ├── image_processor.py      ← Alpha-channel transparent border trim (Pillow)
│   │   ├── validators.py           ← PNG magic bytes, dimensions, file size checks
│   │   ├── asset_manager.py        ← Profile JSON persistence on disk
│   │   ├── models.py               ← BrandProfile, BrandMode enum
│   │   ├── config.py               ← BrandingConfig singleton
│   │   ├── exceptions.py           ← BrandingEngineError hierarchy
│   │   └── profiles/               ← Runtime brand profile store (gitignored)
│   │
│   ├── digital_signature/
│   │   ├── signer.py               ← sign_pdf_file() / sign_document() facade
│   │   ├── pdf_signer.py           ← pyHanko: SimpleSigner + PdfSigner + CMS blob
│   │   ├── certificate_loader.py   ← .pfx/.p12 → CertificateBundle
│   │   ├── certificate_validator.py← Expiry, KeyUsage, algorithm checks
│   │   ├── metadata.py             ← SignatureMetadata dataclass
│   │   ├── signature_config.py     ← DIGEST_ALGORITHM, field name, visible config
│   │   ├── timestamp.py            ← RFC 3161 TSA client (disabled by default)
│   │   ├── verification.py         ← Post-sign signature verification
│   │   ├── exceptions.py           ← DigitalSignatureError hierarchy (14 classes)
│   │   └── utils.py                ← PDF magic check, sanitisation helpers
│   │
│   ├── utils/
│   │   ├── latex_writer.py         ← Template render + path injection + 2-pass XeLaTeX
│   │   ├── file_utils.py           ← extract_text() dispatcher
│   │   ├── pdf_writer.py           ← ReportLab plain-text fallback
│   │   └── retry.py                ← Exponential backoff for Gemini calls
│   │
│   ├── templates/                  ← 6 XeLaTeX document bodies (.tex)
│   ├── layouts/                    ← brand_preamble.tex (fonts, geometry, assets)
│   ├── images/                     ← Turn2Law brand PNGs
│   ├── fonts/                      ← Montserrat + Garet TTF
│   ├── generated_docs/             ← API output directory (gitignored)
│   ├── make_test_cert.py           ← Generate a self-signed test .pfx
│   └── .env                        ← GEMINI_API_KEY (gitignored)
│
├── ARCHITECTURE.md                 ← Deep technical reference
├── SYSTEM_WORKFLOW.md              ← End-to-end pipeline diagrams
└── start-docgen.bat                ← One-click launcher (both services)
```

### API endpoints

| Method | Path | Body | Response |
|--------|------|------|----------|
| `GET` | `/api/templates` | — | All doc types with field lists and icons |
| `GET` | `/api/schema/{doc_type}` | — | Rich field metadata (label, placeholder, type) |
| `POST` | `/api/generate` | JSON | `{success, doc_id, pdf_url, doc_type}` |
| `POST` | `/api/generate-with-branding` | multipart | `{success, doc_id, pdf_url, doc_type}` |
| `POST` | `/api/generate-with-letterhead` | multipart | `{success, doc_id, pdf_url, letterhead_info}` |
| `POST` | `/api/classify` | multipart (file) | `{doc_type, confidence}` |
| `POST` | `/api/sign` | multipart | `{success, doc_id, signed_pdf_url}` |
| `GET` | `/api/preview/{doc_id}` | — | `{exists, pdf_url, signed_url}` |
| `POST` | `/api/validate-cert` | multipart | `{valid, subject, issuer, expires}` |
| `GET` | `/files/{filename}` | — | PDF bytes (static file) |
| `GET` | `/docs` | — | Swagger UI |

All errors return `{"success": false, "error": "human-readable message"}` with HTTP `400` (validation), `404` (not found), or `500` (server error). Stack traces are never sent to the client.

### Example: generate a document

```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "doc_type": "NDA",
    "fields": {
      "Name": "Arjun Mehta",
      "Company": "Nexus Innovations Pvt. Ltd., Bengaluru",
      "Date": "10 July 2026",
      "Term": "two (2) years",
      "Jurisdiction": "Chennai, Tamil Nadu"
    }
  }'
```

```json
{ "success": true, "doc_id": "abc123def456", "pdf_url": "/files/abc123def456.pdf", "doc_type": "NDA" }
```

---

## Document types and fields

All six document types use **Indian jurisdiction** (Indian Contract Act, 1872). Arbitration seat defaults to the `Jurisdiction` field value.

| Document | Required fields | Key optional fields |
|---|---|---|
| **Onboarding Letter** | Employee_Name, Emp_ID, Role, Joining_Date, Document_Date | — |
| **NDA** | Name, Company, Date, Term, Jurisdiction | Confidential_Info_Description, Governing_Law |
| **Offer Letter** | Name, Company, Position, Start_Date, Salary | Manager_Name, Response_Date, Benefits_Description |
| **Service Contract** | Client_Name, Company, Contract_Creation_Date, Service_Description, Payment_Amount, Start_Date, End_Date | Payment_Schedule, Termination_Clause |
| **MOU** | PartyA_Name, PartyB_Name, Date, Purpose, Term, Jurisdiction | Confidentiality, Governing_Law |
| **IP Assignment** | Name, Company, Date, Term, Jurisdiction | IP_Description, Governing_Law |

Company profile fields (`CP_Company_Name`, `CP_Signatory_Name`, `CP_Designation`, `CP_Company_Address`, `CP_Company_Email`, `CP_Signature_Image`, etc.) are optional and injected automatically from the branding step.

---

## Document generation pipeline

```
User inputs (doc_type + field dict)
        │
        ├─ 1. validate_inputs()   — required fields present and non-empty
        ├─ 2. TEMPLATE_MAP        — resolve .tex file path
        ├─ 3. _merge_company_profile()  — inject CP_* tokens with priority:
        │      customer values > T2L defaults (turn2law mode only) > empty string
        ├─ 4. resolve_preamble()  — pick brand_preamble.tex for the branding mode
        └─ 5. render_latex()
               ├─ inject IMAGES_DIR / FONTS_DIR / LAYOUTS_DIR absolute paths
               ├─ swap preamble (custom/letterhead modes)
               ├─ LaTeX-escape all field values char-by-char
               ├─ replace {{FIELD}} tokens; clear unfilled optional tokens
               ├─ XeLaTeX Pass 1 — layout + TikZ coordinate recording
               └─ XeLaTeX Pass 2 — TikZ overlays + eso-pic background finalised
                       │
                       └──► docgen/generated_docs/{doc_id}.pdf
```

---

## Branding system

### Mode 1 — Turn2Law (default)

No uploads required. Uses Turn2Law's letterhead, gold/charcoal colour scheme, and Montserrat + Garet fonts. The `brand_preamble.tex` integrity is verified with a SHA-256 hash on every request to detect accidental modification.

### Mode 2 — Complete Letterhead

Upload one full-page A4 PNG (your pre-designed letterhead containing header, footer, address block — the whole page). The engine:

- Validates PNG format (magic bytes check)
- Auto-upscales if below 1000 × 1400 px (preserving aspect ratio)
- Auto-detects safe text margins from alpha/luminance row analysis
- Places the PNG as a full-page background on every generated page

Recommended for white-label deployments and firms with an existing brand identity.

```
POST /api/generate-with-letterhead
  letterhead_image: File   (PNG, max 20 MB)
  doc_type:         string
  fields_json:      string  (JSON)
  company_profile_json: string  (JSON, optional)
  signature_image:  File   (PNG, optional)
```

### Mode 3 — Advanced Custom

Provide individual asset PNGs and the engine computes layout automatically.

| Asset | Required | Max size | Notes |
|---|---|---|---|
| Header | Yes | 5 MB | Min 595 px wide |
| Footer | No | 5 MB | — |
| Watermark | No | 5 MB | Centred, 10% opacity |
| Logo | No | 5 MB | Top-left, 200 pt wide |

```
POST /api/generate-with-branding
  header_image:     File   (PNG, required)
  footer_image:     File   (PNG, optional)
  watermark_image:  File   (PNG, optional)
  logo_image:       File   (PNG, optional)
  doc_type:         string
  fields_json:      string  (JSON)
  profile_id:       string
  company_profile_json: string  (JSON, optional)
```

Generated preambles are cached in `docgen/branding/profiles/{profile_id}/brand_preamble.tex`. Delete the file to force regeneration.

### Page layout (custom mode)

```
595.5 pt (A4 width)
┌─────────────────────────────────────────────────────┐
│  Header image (full width)                          │
│  Logo (optional, top-left, 200 pt wide)             │
├─────────────────────────────────────────────────────┤  top margin = max(74, header_pt + 16)
│                                                     │
│  DOCUMENT BODY              left=42pt  right=32pt   │
│  [watermark centred, 10% opacity on every page]     │
│                                                     │
├─────────────────────────────────────────────────────┤  bottom margin = max(66, footer_pt + 16)
│  Footer image (full width)                          │
└─────────────────────────────────────────────────────┘
842.25 pt (A4 height)
```

---

## Digital signature system

Signing uses **CMS/PAdES incremental PDF updates** via pyHanko. The original file bytes are never modified — the CMS blob is appended, keeping the original content hash valid and compatible with Adobe Acrobat signature verification.

### Flow

```
1. load_certificate(cert_path, password)
   └── PKCS#12 → private_key + x509 certificate + chain certs → CertificateBundle

2. validate_certificate(bundle)
   ├── Expiry check      — not_valid_before ≤ now ≤ not_valid_after
   ├── Key usage check   — KeyUsage.digitalSignature == True
   ├── Algorithm check   — MD5/MD2 rejected; SHA-1 warned; SHA-256+ accepted
   └── Chain check       — warns if no intermediates

3. sign_pdf(input_pdf, output_pdf, bundle, metadata)
   ├── SimpleSigner.load_pkcs12()
   ├── IncrementalPdfFileWriter (original bytes untouched)
   ├── SigFieldSpec + TextStampStyle (visible stamp on last page)
   └── PdfSigner.sign_pdf() → CMS blob appended to file
```

### Visible signature stamp

```
┌─────────────────────────────────────────────┐
│  Digitally signed by MOURYA VEER            │
│  Date: 2026.08.08 14:30:00 +00'00'          │
│  Reason: Digitally approved                 │
│  Location: Chennai, India                   │
└─────────────────────────────────────────────┘
```

### asyncio design note

pyHanko calls `asyncio.run()` internally, which conflicts with FastAPI's event loop. Both `/api/sign` and `/api/validate-cert` offload the blocking call to a thread-pool executor so pyHanko runs in a thread with no active event loop:

```python
loop = asyncio.get_running_loop()
await loop.run_in_executor(None, functools.partial(sign_generated_pdf, ...))
```

### Generate a test certificate

```powershell
# Creates docgen/my_cert.pfx  —  password: 123456
.venv\Scripts\python docgen\make_test_cert.py
```

For production, use a **Class 3 DSC** from eMudhra, nCode, or Sify (MCA-approved CAs).

---

## Environment variables

| Variable | File | Default | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | `docgen/.env` | — | Google Gemini API key (required for classification) |
| `GEMINI_MODEL` | `docgen/.env` | `gemini-2.5-flash` | Model name override |
| `BRAND_PROFILES_DIR` | env | `docgen/branding/profiles/` | Profile storage path |
| `BRAND_MAX_ASSET_BYTES` | env | `5242880` (5 MB) | Max PNG asset upload size |
| `BRAND_MIN_HEADER_WIDTH_PX` | env | `595` | Minimum header/footer width |
| `BRAND_ASSET_DPI` | env | `96` | DPI for px → pt conversion |
| `RFC3161_TSA_URL` | env | `http://timestamp.digicert.com` | TSA (disabled by default) |

The frontend has no `.env` file. The backend URL is baked into `next.config.ts` rewrites pointing at `localhost:8000`.

---

## Adding a new document type

| Step | File | Action |
|---|---|---|
| 1 | `docgen/schema.py` | Add `"My_Type": { "required": [...], "optional": [...] }` |
| 2 | `docgen/templates/my_type_template.tex` | Write XeLaTeX body; open with `\input{LAYOUTS_DIR_PLACEHOLDERbrand_preamble}` |
| 3 | `docgen/app.py` | Add to `TEMPLATE_MAP` |
| 4 | `docgen/classifier/classify.py` | Add to `ALLOWED_TYPES` |
| 5 | `docgen/api.py` | Add to `_TEMPLATE_META` and `FIELD_META` |

No endpoint changes needed. The API picks up the new type automatically.

---

## Security properties

| Concern | Implementation |
|---|---|
| Private key in memory | `CertificateBundle.dispose()` clears the reference immediately after signing |
| Certificate password | Cleared in `finally` block — never logged or stored |
| Stack traces | Never sent to client — only message strings returned |
| LaTeX injection | `_escape_latex()` escapes all 10 special LaTeX chars character-by-character |
| XSS | Frontend `_escHtml()` escapes all API/user content before `innerHTML` injection |
| T2L asset leakage | Custom preambles scanned for forbidden Turn2Law asset filenames |
| Directory traversal | `os.path.abspath()` normalises all file paths before use |
| PNG validation | Magic bytes (`\x89PNG\r\n\x1a\n`) checked before Pillow opens any file |
| Certificate expiry | Checked against `datetime.now(UTC)` — not system local time |
| Temp files | All `tempfile.mkdtemp()` directories deleted in `finally` blocks |

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| "Could not load templates" | API server not running | Start the backend first; check port 8000 is free |
| `xelatex: command not found` | MiKTeX/TeX Live not on PATH | Install MiKTeX and add its bin directory to PATH |
| `GEMINI_API_KEY is not set` | Missing `.env` file | Create `docgen/.env` with your key |
| `pyhanko is not installed` | Wrong Python (not venv) | Always launch via `start-docgen.bat` or activate `.venv` first |
| Signing failed: not valid JSON | API returning non-JSON error | Check the backend terminal for the real Python traceback |
| `Certificate expired` | Test cert past validity | Run `make_test_cert.py` to regenerate |
| PDF blank / wrong layout | Stale preamble cache | Delete `docgen/branding/profiles/<id>/brand_preamble.tex` |
| `[WinError 10055]` | Windows socket exhaustion | Run the registry fix below; avoid `--reload` during rapid restarts |
| `RuntimeError: asyncio.run()` | Signing called from async context | Use `/api/sign` only; never call `sign_generated_pdf` directly from an async endpoint |

### Windows socket exhaustion fix

```powershell
# Run as Administrator
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" `
    -Name "TcpTimedWaitDelay" -Value 30 -Type DWord -Force
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" `
    -Name "MaxUserPort" -Value 65534 -Type DWord -Force
```

Wait 30 seconds, then restart the server.

---

## Running the backend without the API

For scripted testing or CLI use, call `app.py` directly:

```powershell
cd documentGeneration-master\docgen
..\.venv\Scripts\python app.py
```

Edit `DOC_TYPE`, `COMPANY_PROFILE`, `SAMPLES`, and `CERT_PATH` at the bottom of `app.py`. Outputs `docgen/output.pdf` (and `docgen/output_signed.pdf` if a certificate is configured).

---

## Legal notice

Turn2Law is a technology platform, not a law firm. Documents generated by this system are not legal advice. For high-stakes or court-facing matters, review all documents with qualified legal counsel before use.

---

*Effivia Turn2Law Legal Pvt. Ltd. · CIN: U63110DL2025PTC443434*
