// ============================================================
// Turn2Law Doc Engine — Shared Type Definitions
// ============================================================

// ── Document types ────────────────────────────────────────

export type DocType =
  | "Onboarding_Letter"
  | "NDA"
  | "Offer_Letter"
  | "Contract"
  | "MOU"
  | "IP_Agreement";

export interface DocTemplate {
  key: DocType;
  id?: DocType;
  name: string;
  description: string;
  icon: string;
  required_fields?: string[];
  optional_fields?: string[];
}

export interface FieldSchema {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea";
}

export interface DocSchema {
  doc_type: DocType;
  required: FieldSchema[];
  optional: FieldSchema[];
}

// ── Branding ──────────────────────────────────────────────

export type BrandingMode = "turn2law" | "custom" | "letterhead";

export interface CompanyProfile {
  CP_Company_Name: string;
  CP_Address: string;
  CP_Phone: string;
  CP_Email: string;
  CP_Website: string;
  CP_Signatory_Name: string;
  CP_Signatory_Title: string;
  CP_Signature_Image: string;
  CP_CIN: string;
}

// ── Document record (stored in user session / history) ────

export type DocumentStatus = "draft" | "generated" | "signed" | "downloaded";

export interface DocumentVersion {
  version: number;
  createdAt: string;
  docId: string;
  pdfUrl: string;
  fields: Record<string, string>;
}

export interface DocumentRecord {
  id: string;                      // local UUID
  userId: string;
  name: string;                    // human label e.g. "NDA with Acme Corp"
  docType: DocType;
  typeName: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  docId: string | null;            // 12-char hex from backend
  pdfUrl: string | null;
  signedPdfUrl: string | null;
  fields: Record<string, string>;
  brandingMode: BrandingMode;
  versions: DocumentVersion[];
  isSigned: boolean;
}

export interface BrandingProfileRecord {
  id: string;
  userId: string;
  name: string;
  mode: BrandingMode;
  companyProfile: Partial<CompanyProfile>;
  assets: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CertificateMetadataRecord {
  id: string;
  userId: string;
  subject: string;
  issuer: string;
  serial?: string;
  expires?: string;
  validatedAt: string;
}

// ── Generation state (wizard multi-step) ─────────────────

export interface GenerationState {
  step: number;                    // 1–9
  docType: DocType | null;
  inputMethod: "form" | "pdf" | "docx" | "image";
  formData: Record<string, string>;
  brandingMode: BrandingMode;
  companyProfile: Partial<CompanyProfile>;
  signatureFile: File | null;
  letterheadFile: File | null;
  brandAssets: {
    header?: File;
    footer?: File;
    watermark?: File;
    logo?: File;
  };
  docId: string | null;
  pdfUrl: string | null;
  signedPdfUrl: string | null;
  certFile: File | null;
  certValidated: boolean;
  signerName: string;
  isGenerating: boolean;
  isSigningLoading: boolean;
  error: string | null;
  editingDocumentId: string | null;
}

// ── API response shapes ───────────────────────────────────

export interface ApiError {
  success: false;
  error: string;
}

export interface GenerateResponse {
  success: true;
  doc_id: string;
  pdf_url: string;
  message: string;
}

export interface ClassifyResponse {
  success: true;
  doc_type: DocType;
  confidence: string;
}

export interface SignResponse {
  success: true;
  signed_pdf_url: string;
  doc_id: string;
  message: string;
}

export interface ValidateCertResponse {
  success: true;
  valid: boolean;
  subject: string;
  issuer: string;
  not_before?: string;
  not_after?: string;
  serial?: string;
  expires?: string;
}

export interface PreviewResponse {
  success: true;
  exists: boolean;
  pdf_url: string;
}

// ── User / Auth (mock — no real backend yet) ─────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string; // initials e.g. "MV"
  plan: "free" | "pro" | "enterprise";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
