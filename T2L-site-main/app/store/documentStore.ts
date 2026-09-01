// ============================================================
// Turn2Law — Document Store (Zustand)
// Persists document history + draft state across navigation.
// ============================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  DocumentRecord,
  DocumentVersion,
  GenerationState,
  DocType,
  BrandingMode,
  CompanyProfile,
  BrandingProfileRecord,
  CertificateMetadataRecord,
} from "../types/docengine";

const STORE_VERSION = 1;

const defaultGenState = (): GenerationState => ({
  step: 1,
  docType: null,
  inputMethod: "form",
  formData: {},
  brandingMode: "turn2law",
  companyProfile: {},
  signatureFile: null,
  letterheadFile: null,
  brandAssets: {},
  docId: null,
  pdfUrl: null,
  signedPdfUrl: null,
  certFile: null,
  certValidated: false,
  signerName: "",
  isGenerating: false,
  isSigningLoading: false,
  error: null,
  editingDocumentId: null,
});

interface DocumentStore {
  documents: DocumentRecord[];
  brandingProfiles: BrandingProfileRecord[];
  certificates: CertificateMetadataRecord[];
  addDocument: (doc: DocumentRecord) => void;
  updateDocument: (id: string, patch: Partial<DocumentRecord>) => void;
  deleteDocument: (id: string) => void;
  addVersion: (docId: string, version: DocumentVersion) => void;
  getDocument: (id: string) => DocumentRecord | undefined;
  addBrandingProfile: (profile: BrandingProfileRecord) => void;
  addCertificateMetadata: (certificate: CertificateMetadataRecord) => void;

  gen: GenerationState;
  setGenStep: (step: number) => void;
  setDocType: (docType: DocType) => void;
  setInputMethod: (method: GenerationState["inputMethod"]) => void;
  setFormData: (data: Record<string, string>) => void;
  setBrandingMode: (mode: BrandingMode) => void;
  setCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  setSignatureFile: (file: File | null) => void;
  setLetterheadFile: (file: File | null) => void;
  setBrandAssets: (assets: GenerationState["brandAssets"]) => void;
  setDocId: (docId: string, pdfUrl: string) => void;
  setSignedPdfUrl: (url: string) => void;
  setCertFile: (file: File | null) => void;
  setCertValidated: (valid: boolean) => void;
  setSignerName: (name: string) => void;
  setIsGenerating: (v: boolean) => void;
  setIsSigningLoading: (v: boolean) => void;
  setGenError: (err: string | null) => void;
  setEditingDocumentId: (id: string | null) => void;
  resetGen: () => void;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: [],
      brandingProfiles: [],
      certificates: [],

      addDocument: (doc) =>
        set((s) => ({ documents: [doc, ...s.documents] })),

      updateDocument: (id, patch) =>
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d
          ),
        })),

      deleteDocument: (id) =>
        set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),

      addVersion: (docId, version) =>
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === docId
              ? { ...d, versions: [...(d.versions ?? []), version], updatedAt: new Date().toISOString() }
              : d
          ),
        })),

      getDocument: (id) => get().documents.find((d) => d.id === id),

      addBrandingProfile: (profile) =>
        set((s) => ({
          brandingProfiles: [
            profile,
            ...s.brandingProfiles.filter((p) => p.id !== profile.id),
          ],
        })),

      addCertificateMetadata: (certificate) =>
        set((s) => ({
          certificates: [
            certificate,
            ...s.certificates.filter((c) => c.id !== certificate.id),
          ],
        })),

      gen: defaultGenState(),

      setGenStep: (step) => set((s) => ({ gen: { ...s.gen, step } })),
      setDocType: (docType) => set((s) => ({ gen: { ...s.gen, docType, step: 2 } })),
      setInputMethod: (inputMethod) => set((s) => ({ gen: { ...s.gen, inputMethod } })),
      setFormData: (formData) => set((s) => ({ gen: { ...s.gen, formData } })),
      setBrandingMode: (brandingMode) => set((s) => ({ gen: { ...s.gen, brandingMode } })),
      setCompanyProfile: (companyProfile) => set((s) => ({ gen: { ...s.gen, companyProfile } })),
      setSignatureFile: (signatureFile) => set((s) => ({ gen: { ...s.gen, signatureFile } })),
      setLetterheadFile: (letterheadFile) => set((s) => ({ gen: { ...s.gen, letterheadFile } })),
      setBrandAssets: (brandAssets) => set((s) => ({ gen: { ...s.gen, brandAssets } })),
      setDocId: (docId, pdfUrl) => set((s) => ({ gen: { ...s.gen, docId, pdfUrl } })),
      setSignedPdfUrl: (signedPdfUrl) => set((s) => ({ gen: { ...s.gen, signedPdfUrl } })),
      setCertFile: (certFile) => set((s) => ({ gen: { ...s.gen, certFile } })),
      setCertValidated: (certValidated) => set((s) => ({ gen: { ...s.gen, certValidated } })),
      setSignerName: (signerName) => set((s) => ({ gen: { ...s.gen, signerName } })),
      setIsGenerating: (isGenerating) => set((s) => ({ gen: { ...s.gen, isGenerating } })),
      setIsSigningLoading: (isSigningLoading) => set((s) => ({ gen: { ...s.gen, isSigningLoading } })),
      setGenError: (error) => set((s) => ({ gen: { ...s.gen, error } })),
      setEditingDocumentId: (editingDocumentId) =>
        set((s) => ({ gen: { ...s.gen, editingDocumentId } })),
      resetGen: () => set({ gen: defaultGenState() }),
    }),
    {
      name: "t2l-documents",
      storage: createJSONStorage(() => localStorage),
      version: STORE_VERSION,
      partialize: (state) => ({
        documents: state.documents,
        brandingProfiles: state.brandingProfiles,
        certificates: state.certificates,
      }),
      migrate(persisted: unknown, fromVersion: number) {
        console.warn(
          `[t2l-store] migrating localStorage from v${fromVersion} → v${STORE_VERSION}`
        );
        void persisted;
        return {
          documents: [],
          brandingProfiles: [],
          certificates: [],
        };
      },
    }
  )
);
