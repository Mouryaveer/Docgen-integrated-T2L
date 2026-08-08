// ============================================================
// Turn2Law Doc Engine — API Service Layer
// All FastAPI calls go through here. UI components never
// call fetch/axios directly.
// ============================================================

import axios, { AxiosError } from "axios";
import type {
  DocTemplate,
  DocSchema,
  DocType,
  GenerateResponse,
  ClassifyResponse,
  SignResponse,
  ValidateCertResponse,
  PreviewResponse,
  BrandingMode,
  CompanyProfile,
} from "../types/docengine";

// Next.js rewrites /api/docengine/* → http://localhost:8000/api/*
const BASE = "/api/docengine";

// ── helpers ───────────────────────────────────────────────

function extractError(err: unknown): string {
  if (err instanceof AxiosError) {
    // Network-level failure — backend is not reachable
    if (!err.response) {
      const code = (err as { code?: string }).code;
      if (
        code === "ECONNREFUSED" ||
        code === "ERR_NETWORK" ||
        err.message.toLowerCase().includes("network")
      ) {
        return "Cannot reach the document engine. Make sure the backend server is running on port 8000 (run start-docgen.bat).";
      }
      return `Network error: ${err.message}`;
    }
    // HTTP error with a JSON body from the API
    const data = err.response.data as Record<string, unknown> | undefined;
    if (data?.error) return String(data.error);
    if (data?.detail) return String(data.detail);
    // Non-JSON response (e.g. FastAPI default 500 HTML page)
    const raw = err.response.data as unknown;
    if (typeof raw === "string" && raw.length < 300) return raw;
    return `Server error ${err.response.status}: ${err.response.statusText || "unexpected response"}`;
  }
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred. Please try again.";
}

// ── Backend availability check ────────────────────────────

/** Returns true if the backend is reachable. Never throws. */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await axios.get(`${BASE}/templates`, { timeout: 3000 });
    return res.status === 200;
  } catch {
    return false;
  }
}

// ── Template catalogue ────────────────────────────────────

export async function fetchTemplates(): Promise<DocTemplate[]> {
  try {
    const { data } = await axios.get<DocTemplate[] | { templates: DocTemplate[] }>(
      `${BASE}/templates`
    );
    const templates = Array.isArray(data) ? data : data.templates;
    return templates.map((template) => ({
      ...template,
      key: template.key ?? template.id,
    })) as DocTemplate[];
  } catch (err) {
    throw new Error(extractError(err));
  }
}

// ── Field schema for one doc type ─────────────────────────

export async function fetchSchema(docType: DocType): Promise<DocSchema> {
  try {
    const { data } = await axios.get<DocSchema>(
      `${BASE}/schema/${docType}`
    );
    return data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

// ── Classify uploaded document ────────────────────────────

export async function classifyDocument(file: File): Promise<ClassifyResponse> {
  try {
    const form = new FormData();
    form.append("file", file);
    const { data } = await axios.post<ClassifyResponse>(
      `${BASE}/classify`,
      form
    );
    return data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

// ── Generate document — three modes ──────────────────────

interface GenerateJsonPayload {
  doc_type: DocType;
  fields: Record<string, string>;
}

export async function generateDocument(
  payload: GenerateJsonPayload
): Promise<GenerateResponse> {
  try {
    const { data } = await axios.post<GenerateResponse>(
      `${BASE}/generate`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

interface GenerateWithBrandingPayload {
  doc_type: DocType;
  fields: Record<string, string>;
  companyProfile: Partial<CompanyProfile>;
  brandingMode: BrandingMode;
  signatureFile?: File | null;
  headerImage?: File | null;
  footerImage?: File | null;
  watermarkImage?: File | null;
  logoImage?: File | null;
}

export async function generateWithBranding(
  payload: GenerateWithBrandingPayload
): Promise<GenerateResponse> {
  try {
    const form = new FormData();
    form.append("doc_type", payload.doc_type);
    form.append("fields_json", JSON.stringify(payload.fields));
    form.append("profile_id", `web-${Date.now().toString(36)}`);
    form.append("profile_name", `${payload.companyProfile.CP_Company_Name ?? "Workspace"} branding`);
    form.append(
      "company_profile_json",
      JSON.stringify(payload.companyProfile)
    );

    if (payload.signatureFile) form.append("signature_image", payload.signatureFile);
    if (payload.headerImage)   form.append("header_image",    payload.headerImage);
    if (payload.footerImage)   form.append("footer_image",    payload.footerImage);
    if (payload.watermarkImage) form.append("watermark_image", payload.watermarkImage);
    if (payload.logoImage)     form.append("logo_image",      payload.logoImage);

    const { data } = await axios.post<GenerateResponse>(
      `${BASE}/generate-with-branding`,
      form
    );
    return data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

interface GenerateWithLetterheadPayload {
  doc_type: DocType;
  fields: Record<string, string>;
  companyProfile: Partial<CompanyProfile>;
  letterheadFile: File;
  signatureFile?: File | null;
}

export async function generateWithLetterhead(
  payload: GenerateWithLetterheadPayload
): Promise<GenerateResponse> {
  try {
    const form = new FormData();
    form.append("doc_type", payload.doc_type);
    form.append("fields_json", JSON.stringify(payload.fields));
    form.append("profile_id", `letterhead-${Date.now().toString(36)}`);
    form.append("profile_name", `${payload.companyProfile.CP_Company_Name ?? "Workspace"} letterhead`);
    form.append(
      "company_profile_json",
      JSON.stringify(payload.companyProfile)
    );
    form.append("letterhead_image", payload.letterheadFile);
    if (payload.signatureFile) form.append("signature_image", payload.signatureFile);

    const { data } = await axios.post<GenerateResponse>(
      `${BASE}/generate-with-letterhead`,
      form
    );
    return data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

// ── Preview existence check ───────────────────────────────

export async function checkPreview(docId: string): Promise<PreviewResponse> {
  try {
    const { data } = await axios.get<PreviewResponse>(
      `${BASE}/preview/${docId}`
    );
    return data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

// ── Certificate validation ────────────────────────────────

export async function validateCertificate(
  certFile: File,
  password: string
): Promise<ValidateCertResponse> {
  try {
    const form = new FormData();
    form.append("cert_file", certFile);
    form.append("cert_password", password);
    const { data } = await axios.post<ValidateCertResponse>(
      `${BASE}/validate-cert`,
      form
    );
    return data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

// ── Sign document ─────────────────────────────────────────

interface SignPayload {
  docId: string;
  certFile: File;
  password: string;
  signerName: string;
  signerReason?: string;
  signerLocation?: string;
}

export async function signDocument(
  payload: SignPayload
): Promise<SignResponse> {
  try {
    const form = new FormData();
    form.append("doc_id",         payload.docId);
    form.append("cert_file",      payload.certFile);
    form.append("cert_password",  payload.password);
    form.append("signer_name",    payload.signerName);
    form.append("reason",         payload.signerReason ?? "Approved");
    form.append("location",       payload.signerLocation ?? "India");
    const { data } = await axios.post<SignResponse>(`${BASE}/sign`, form);
    return data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}
