"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDocumentStore } from "../../store/documentStore";
import {
  fetchTemplates,
  fetchSchema,
  generateDocument,
  generateWithBranding,
  generateWithLetterhead,
  validateCertificate,
  signDocument,
} from "../../services/docengine";
import type {
  BrandingMode,
  CompanyProfile,
  DocSchema,
  DocTemplate,
  DocType,
  DocumentRecord,
} from "../../types/docengine";

type WorkspaceView =
  | "overview"
  | "create"
  | "review"
  | "preview"
  | "sign"
  | "history"
  | "documents"
  | "templates"
  | "branding"
  | "signatures";

const FALLBACK_TEMPLATES: DocTemplate[] = [
  { key: "NDA", name: "Non-Disclosure Agreement", description: "Protect confidential information between parties.", icon: "shield" },
  { key: "Offer_Letter", name: "Offer Letter", description: "Employment offer with role, start date, and compensation.", icon: "briefcase" },
  { key: "Onboarding_Letter", name: "Onboarding Letter", description: "Employee welcome and joining documentation.", icon: "user-plus" },
  { key: "Contract", name: "Service Contract", description: "B2B services, milestones, payment, and termination.", icon: "file-text" },
  { key: "MOU", name: "Memorandum of Understanding", description: "Collaboration framework between two parties.", icon: "handshake" },
  { key: "IP_Agreement", name: "IP Assignment Agreement", description: "Transfer and assignment of intellectual property.", icon: "cpu" },
];

const FALLBACK_SCHEMA: Record<DocType, DocSchema> = {
  NDA: {
    doc_type: "NDA",
    required: [
      { key: "Name", label: "Party Name", placeholder: "Full legal name", type: "text" },
      { key: "Company", label: "Company / Address", placeholder: "Company name and address", type: "text" },
      { key: "Date", label: "Effective Date", placeholder: "10 July 2026", type: "text" },
      { key: "Term", label: "Term", placeholder: "two (2) years", type: "text" },
      { key: "Jurisdiction", label: "Jurisdiction", placeholder: "Chennai, Tamil Nadu", type: "text" },
    ],
    optional: [],
  },
  Offer_Letter: {
    doc_type: "Offer_Letter",
    required: [
      { key: "Name", label: "Candidate Name", placeholder: "Full legal name", type: "text" },
      { key: "Company", label: "Address", placeholder: "Candidate address", type: "text" },
      { key: "Position", label: "Position", placeholder: "Legal Associate", type: "text" },
      { key: "Start_Date", label: "Start Date", placeholder: "1 August 2026", type: "text" },
      { key: "Salary", label: "Salary / CTC", placeholder: "INR 6,00,000", type: "text" },
    ],
    optional: [],
  },
  Onboarding_Letter: {
    doc_type: "Onboarding_Letter",
    required: [
      { key: "Employee_Name", label: "Employee Name", placeholder: "Full legal name", type: "text" },
      { key: "Emp_ID", label: "Employee ID", placeholder: "T2L-AI-041", type: "text" },
      { key: "Role", label: "Role", placeholder: "AIML Intern", type: "text" },
      { key: "Joining_Date", label: "Joining Date", placeholder: "20 July 2026", type: "text" },
      { key: "Document_Date", label: "Document Date", placeholder: "30 June 2026", type: "text" },
    ],
    optional: [],
  },
  Contract: {
    doc_type: "Contract",
    required: [
      { key: "Client_Name", label: "Client Name", placeholder: "Client legal name", type: "text" },
      { key: "Company", label: "Company / Address", placeholder: "Address", type: "text" },
      { key: "Contract_Creation_Date", label: "Contract Date", placeholder: "10 July 2026", type: "text" },
      { key: "Service_Description", label: "Services", placeholder: "Describe services", type: "textarea" },
      { key: "Payment_Amount", label: "Payment Amount", placeholder: "INR 1,50,000", type: "text" },
      { key: "Start_Date", label: "Start Date", placeholder: "15 July 2026", type: "text" },
      { key: "End_Date", label: "End Date", placeholder: "14 January 2027", type: "text" },
    ],
    optional: [],
  },
  MOU: {
    doc_type: "MOU",
    required: [
      { key: "PartyA_Name", label: "Party A", placeholder: "First party", type: "text" },
      { key: "PartyB_Name", label: "Party B", placeholder: "Second party", type: "text" },
      { key: "Date", label: "Date", placeholder: "10 July 2026", type: "text" },
      { key: "Purpose", label: "Purpose", placeholder: "Collaboration purpose", type: "textarea" },
      { key: "Term", label: "Term", placeholder: "one (1) year", type: "text" },
      { key: "Jurisdiction", label: "Jurisdiction", placeholder: "Chennai, Tamil Nadu", type: "text" },
    ],
    optional: [],
  },
  IP_Agreement: {
    doc_type: "IP_Agreement",
    required: [
      { key: "Name", label: "Assignor Name", placeholder: "Full legal name", type: "text" },
      { key: "Company", label: "Company / Address", placeholder: "Company and address", type: "text" },
      { key: "Date", label: "Date", placeholder: "10 July 2026", type: "text" },
      { key: "Term", label: "Term", placeholder: "Engagement duration", type: "text" },
      { key: "Jurisdiction", label: "Jurisdiction", placeholder: "Chennai, Tamil Nadu", type: "text" },
    ],
    optional: [],
  },
};

export default function DocEngineWorkspace({ view }: { view: WorkspaceView }) {
  const { user } = useAuth();
  const store = useDocumentStore();
  const [templates, setTemplates] = useState<DocTemplate[]>(FALLBACK_TEMPLATES);
  const [schema, setSchema] = useState<DocSchema | null>(FALLBACK_SCHEMA.NDA);
  const [message, setMessage] = useState<string | null>(null);
  const [certPassword, setCertPassword] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const userId = user?.id ?? "anonymous";
  const documents = useMemo(
    () => store.documents.filter((doc) => doc.userId === userId),
    [store.documents, userId]
  );
  const activeDocument =
    documents.find((doc) => doc.id === selectedDocumentId) ?? documents[0];

  useEffect(() => {
    fetchTemplates()
      .then((items) => setTemplates(items.length ? items : FALLBACK_TEMPLATES))
      .catch(() => setTemplates(FALLBACK_TEMPLATES));
  }, []);

  useEffect(() => {
    const docType = store.gen.docType ?? "NDA";
    fetchSchema(docType)
      .then(setSchema)
      .catch(() => setSchema(FALLBACK_SCHEMA[docType]));
  }, [store.gen.docType]);

  const stats = [
    { label: "Documents", value: documents.length },
    { label: "Signed", value: documents.filter((doc) => doc.isSigned).length },
    { label: "Drafts", value: documents.filter((doc) => doc.status === "draft").length },
    { label: "Versions", value: documents.reduce((sum, doc) => sum + doc.versions.length, 0) },
  ];

  async function handleGenerate() {
    if (!user || !store.gen.docType) {
      setMessage("Select a template before generating.");
      return;
    }

    setMessage(null);
    store.setIsGenerating(true);
    store.setGenError(null);

    try {
      const payload = {
        doc_type: store.gen.docType,
        fields: store.gen.formData,
        companyProfile: store.gen.companyProfile,
      };
      const result =
        store.gen.brandingMode === "letterhead" && store.gen.letterheadFile
          ? await generateWithLetterhead({ ...payload, letterheadFile: store.gen.letterheadFile, signatureFile: store.gen.signatureFile })
          : store.gen.brandingMode === "custom"
            ? await generateWithBranding({
                ...payload,
                brandingMode: "custom",
                signatureFile: store.gen.signatureFile,
                headerImage: store.gen.brandAssets.header ?? null,
                footerImage: store.gen.brandAssets.footer ?? null,
                watermarkImage: store.gen.brandAssets.watermark ?? null,
                logoImage: store.gen.brandAssets.logo ?? null,
              })
            : await generateDocument({ doc_type: store.gen.docType, fields: store.gen.formData });

      const typeName = templates.find((template) => template.key === store.gen.docType)?.name ?? store.gen.docType;
      const now = new Date().toISOString();
      const existing = store.gen.editingDocumentId ? store.getDocument(store.gen.editingDocumentId) : undefined;
      const record: DocumentRecord = {
        id: existing?.id ?? crypto.randomUUID(),
        userId: user.id,
        name: buildDocumentName(typeName, store.gen.formData),
        docType: store.gen.docType,
        typeName,
        status: "generated",
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        docId: result.doc_id,
        pdfUrl: result.pdf_url,
        signedPdfUrl: existing?.signedPdfUrl ?? null,
        fields: store.gen.formData,
        brandingMode: store.gen.brandingMode,
        versions: [
          ...(existing?.versions ?? []),
          {
            version: (existing?.versions.length ?? 0) + 1,
            createdAt: now,
            docId: result.doc_id,
            pdfUrl: result.pdf_url,
            fields: store.gen.formData,
          },
        ],
        isSigned: Boolean(existing?.isSigned),
      };

      if (existing) store.updateDocument(existing.id, record);
      else store.addDocument(record);
      if (store.gen.brandingMode !== "turn2law") {
        store.addBrandingProfile({
          id: `${user.id}-${store.gen.brandingMode}-${result.doc_id}`,
          userId: user.id,
          name: store.gen.companyProfile.CP_Company_Name ?? `${typeName} branding`,
          mode: store.gen.brandingMode,
          companyProfile: store.gen.companyProfile,
          assets: [
            store.gen.letterheadFile?.name,
            store.gen.signatureFile?.name,
            store.gen.brandAssets.header?.name,
            store.gen.brandAssets.footer?.name,
            store.gen.brandAssets.watermark?.name,
            store.gen.brandAssets.logo?.name,
          ].filter(Boolean) as string[],
          createdAt: existing?.createdAt ?? now,
          updatedAt: now,
        });
      }
      store.setDocId(result.doc_id, result.pdf_url);
      store.setEditingDocumentId(record.id);
      setSelectedDocumentId(record.id);
      setMessage("Document generated and saved to My Documents.");
    } catch (err) {
      const error = err instanceof Error ? err.message : "Document generation failed.";
      store.setGenError(cleanError(error));
      setMessage(cleanError(error));
    } finally {
      store.setIsGenerating(false);
    }
  }

  async function handleValidateCertificate() {
    if (!user || !store.gen.certFile || !certPassword) {
      setMessage("Upload a certificate and enter its password to validate.");
      return;
    }
    try {
      const result = await validateCertificate(store.gen.certFile, certPassword);
      if (!result.valid) throw new Error("Certificate validation failed.");
      store.setCertValidated(true);
      store.addCertificateMetadata({
        id: crypto.randomUUID(),
        userId: user.id,
        subject: result.subject,
        issuer: result.issuer,
        serial: result.serial,
        expires: result.expires ?? result.not_after,
        validatedAt: new Date().toISOString(),
      });
      setMessage("Certificate validated. Only metadata was stored.");
    } catch (err) {
      store.setCertValidated(false);
      setMessage(cleanError(err instanceof Error ? err.message : "Certificate validation failed."));
    }
  }

  async function handleSign() {
    const doc = activeDocument;
    if (!doc?.docId || !store.gen.certFile || !certPassword || !store.gen.signerName) {
      setMessage("Choose a generated document, certificate, password, and signer name.");
      return;
    }
    store.setIsSigningLoading(true);
    try {
      const result = await signDocument({
        docId: doc.docId,
        certFile: store.gen.certFile,
        password: certPassword,
        signerName: store.gen.signerName,
        signerReason: "Digitally approved",
        signerLocation: "India",
      });
      store.updateDocument(doc.id, {
        status: "signed",
        signedPdfUrl: result.signed_pdf_url,
        isSigned: true,
      });
      store.setSignedPdfUrl(result.signed_pdf_url);
      setMessage("Signed PDF is ready to download.");
    } catch (err) {
      setMessage(cleanError(err instanceof Error ? err.message : "Signing failed."));
    } finally {
      store.setIsSigningLoading(false);
    }
  }

  return (
    <section className="de-workspace">
      <div className="de-page-head">
        <div>
          <p className="de-kicker">Turn2Law Doc Engine</p>
          <h1>{titleFor(view)}</h1>
          <p>{subtitleFor(view)}</p>
        </div>
        <div className="de-head-actions">
          <Link className="de-btn secondary" href="/dashboard/doc-engine/history">History</Link>
          <Link className="de-btn primary" href="/dashboard/doc-engine/create">Create</Link>
        </div>
      </div>

      {message && <div className="de-alert">{message}</div>}

      {(view === "overview" || view === "documents") && (
        <>
          <div className="de-stat-grid">
            {stats.map((stat) => (
              <div className="de-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <DocumentTable documents={documents} setSelectedDocumentId={setSelectedDocumentId} />
        </>
      )}

      {(view === "create" || view === "review") && (
        <div className="de-grid">
          <div className="de-panel">
            <h2>Template</h2>
            <div className="de-template-grid">
              {templates.map((template) => (
                <button
                  className={`de-template ${store.gen.docType === template.key ? "active" : ""}`}
                  key={template.key}
                  onClick={() => store.setDocType(template.key)}
                >
                  <span>{template.name}</span>
                  <small>{template.description}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="de-panel">
            <h2>Draft Details</h2>
            <div className="de-form-grid">
              {schema?.required.map((field) => (
                <label className="de-field" key={field.key}>
                  <span>{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      placeholder={field.placeholder}
                      value={store.gen.formData[field.key] ?? ""}
                      onChange={(event) => store.setFormData({ ...store.gen.formData, [field.key]: event.target.value })}
                    />
                  ) : (
                    <input
                      placeholder={field.placeholder}
                      value={store.gen.formData[field.key] ?? ""}
                      onChange={(event) => store.setFormData({ ...store.gen.formData, [field.key]: event.target.value })}
                    />
                  )}
                </label>
              ))}
            </div>
          </div>

          <BrandingPanel
            mode={store.gen.brandingMode}
            companyProfile={store.gen.companyProfile}
            onMode={store.setBrandingMode}
            onCompanyProfile={store.setCompanyProfile}
            onLetterhead={store.setLetterheadFile}
            onSignature={store.setSignatureFile}
            onAssets={store.setBrandAssets}
          />

          <div className="de-panel">
            <h2>Review</h2>
            <ul className="de-checklist">
              <li>Required fields are checked by the FastAPI schema before generation.</li>
              <li>Branding assets are uploaded only for this generation request.</li>
              <li>Each successful edit creates a new saved version.</li>
            </ul>
            {store.gen.error && <div className="de-alert danger">{store.gen.error}</div>}
            <button className="de-btn primary" onClick={handleGenerate} disabled={store.gen.isGenerating}>
              {store.gen.isGenerating ? "Generating..." : "Generate PDF"}
            </button>
          </div>
        </div>
      )}

      {view === "preview" && (
        <div className="de-grid two">
          <DocumentPicker documents={documents} activeId={activeDocument?.id} onPick={setSelectedDocumentId} />
          <div className="de-panel">
            <h2>PDF Preview</h2>
            {activeDocument?.pdfUrl ? (
              <>
                <iframe className="de-preview" src={activeDocument.pdfUrl} title="Generated PDF preview" />
                <a className="de-btn primary" href={activeDocument.pdfUrl} download>Download PDF</a>
              </>
            ) : (
              <EmptyState text="Generate a document to preview it here." />
            )}
          </div>
        </div>
      )}

      {view === "sign" && (
        <div className="de-grid two">
          <DocumentPicker documents={documents} activeId={activeDocument?.id} onPick={setSelectedDocumentId} />
          <div className="de-panel">
            <h2>Digital Signature</h2>
            <label className="de-field">
              <span>PKCS#12 Certificate</span>
              <input type="file" accept=".pfx,.p12" onChange={(event) => store.setCertFile(event.target.files?.[0] ?? null)} />
            </label>
            <label className="de-field">
              <span>Certificate Password</span>
              <input type="password" value={certPassword} onChange={(event) => setCertPassword(event.target.value)} />
            </label>
            <label className="de-field">
              <span>Signer Name</span>
              <input value={store.gen.signerName} onChange={(event) => store.setSignerName(event.target.value)} />
            </label>
            <div className="de-row">
              <button className="de-btn secondary" onClick={handleValidateCertificate}>Validate</button>
              <button className="de-btn primary" onClick={handleSign} disabled={store.gen.isSigningLoading}>
                {store.gen.isSigningLoading ? "Signing..." : "Sign PDF"}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "history" && <VersionHistory documents={documents} />}
      {view === "templates" && <TemplateCatalogue templates={templates} onUse={store.setDocType} />}
      {view === "branding" && <BrandingLibrary />}
      {view === "signatures" && <SignatureLibrary />}
    </section>
  );
}

function BrandingPanel(props: {
  mode: BrandingMode;
  companyProfile: Partial<CompanyProfile>;
  onMode: (mode: BrandingMode) => void;
  onCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  onLetterhead: (file: File | null) => void;
  onSignature: (file: File | null) => void;
  onAssets: (assets: { header?: File; footer?: File; watermark?: File; logo?: File }) => void;
}) {
  const [assets, setAssets] = useState<{ header?: File; footer?: File; watermark?: File; logo?: File }>({});
  const updateAsset = (key: keyof typeof assets, file: File | null) => {
    const next = { ...assets, [key]: file ?? undefined };
    setAssets(next);
    props.onAssets(next);
  };

  return (
    <div className="de-panel">
      <h2>Branding</h2>
      <div className="de-segments">
        {(["turn2law", "custom", "letterhead"] as BrandingMode[]).map((mode) => (
          <button className={props.mode === mode ? "active" : ""} key={mode} onClick={() => props.onMode(mode)}>
            {mode === "turn2law" ? "Turn2Law" : mode === "custom" ? "Advanced" : "Letterhead"}
          </button>
        ))}
      </div>
      <div className="de-form-grid">
        {["CP_Company_Name", "CP_Signatory_Name", "CP_Company_Email", "CP_Company_Website"].map((key) => (
          <label className="de-field" key={key}>
            <span>{key.replaceAll("_", " ")}</span>
            <input
              value={String(props.companyProfile[key as keyof CompanyProfile] ?? "")}
              onChange={(event) => props.onCompanyProfile({ ...props.companyProfile, [key]: event.target.value })}
            />
          </label>
        ))}
      </div>
      {props.mode === "letterhead" && (
        <label className="de-field">
          <span>Complete Letterhead</span>
          <input type="file" accept="image/png,image/jpeg" onChange={(event) => props.onLetterhead(event.target.files?.[0] ?? null)} />
        </label>
      )}
      {props.mode === "custom" && (
        <div className="de-form-grid">
          <label className="de-field"><span>Header</span><input type="file" accept="image/png,image/jpeg" onChange={(event) => updateAsset("header", event.target.files?.[0] ?? null)} /></label>
          <label className="de-field"><span>Footer</span><input type="file" accept="image/png,image/jpeg" onChange={(event) => updateAsset("footer", event.target.files?.[0] ?? null)} /></label>
          <label className="de-field"><span>Watermark</span><input type="file" accept="image/png,image/jpeg" onChange={(event) => updateAsset("watermark", event.target.files?.[0] ?? null)} /></label>
          <label className="de-field"><span>Logo</span><input type="file" accept="image/png,image/jpeg" onChange={(event) => updateAsset("logo", event.target.files?.[0] ?? null)} /></label>
        </div>
      )}
      <label className="de-field">
        <span>Signature Image</span>
        <input type="file" accept="image/png,image/jpeg" onChange={(event) => props.onSignature(event.target.files?.[0] ?? null)} />
      </label>
    </div>
  );
}

function DocumentTable({ documents, setSelectedDocumentId }: { documents: DocumentRecord[]; setSelectedDocumentId: (id: string) => void }) {
  if (!documents.length) return <EmptyState text="No documents yet. Create your first legal document from the Doc Engine." />;
  return (
    <div className="de-panel">
      <h2>My Documents</h2>
      <div className="de-table">
        {documents.map((doc) => (
          <div className="de-table-row" key={doc.id}>
            <div>
              <strong>{doc.name}</strong>
              <span>{doc.typeName} - {new Date(doc.updatedAt).toLocaleDateString()}</span>
            </div>
            <span className={`de-status ${doc.status}`}>{doc.status}</span>
            <span>{doc.versions.length} versions</span>
            <div className="de-row right">
              {doc.pdfUrl && <a href={doc.pdfUrl} download>PDF</a>}
              {doc.signedPdfUrl && <a href={doc.signedPdfUrl} download>Signed</a>}
              <button onClick={() => setSelectedDocumentId(doc.id)}>Open</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentPicker({ documents, activeId, onPick }: { documents: DocumentRecord[]; activeId?: string; onPick: (id: string) => void }) {
  return (
    <div className="de-panel">
      <h2>Choose Document</h2>
      <div className="de-stack">
        {documents.map((doc) => (
          <button className={`de-doc-pick ${activeId === doc.id ? "active" : ""}`} key={doc.id} onClick={() => onPick(doc.id)}>
            <strong>{doc.name}</strong>
            <span>{doc.status} - {doc.typeName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function VersionHistory({ documents }: { documents: DocumentRecord[] }) {
  return (
    <div className="de-panel">
      <h2>Version History</h2>
      <div className="de-table">
        {documents.flatMap((doc) =>
          doc.versions.map((version) => (
            <div className="de-table-row" key={`${doc.id}-${version.version}`}>
              <div>
                <strong>{doc.name}</strong>
                <span>Version {version.version} - {new Date(version.createdAt).toLocaleString()}</span>
              </div>
              <a href={version.pdfUrl} download>Download</a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TemplateCatalogue({ templates, onUse }: { templates: DocTemplate[]; onUse: (docType: DocType) => void }) {
  return (
    <div className="de-template-grid wide">
      {templates.map((template) => (
        <Link className="de-template" href="/dashboard/doc-engine/create" key={template.key} onClick={() => onUse(template.key)}>
          <span>{template.name}</span>
          <small>{template.description}</small>
        </Link>
      ))}
    </div>
  );
}

function BrandingLibrary() {
  const { user } = useAuth();
  const profiles = useDocumentStore((state) => state.brandingProfiles.filter((profile) => profile.userId === user?.id));
  return (
    <div className="de-panel">
      <h2>Branding Profiles</h2>
      {profiles.length ? profiles.map((profile) => (
        <div className="de-table-row" key={profile.id}>
          <div><strong>{profile.name}</strong><span>{profile.mode} - {profile.assets.length} assets</span></div>
        </div>
      )) : <EmptyState text="Branding profiles are created as you generate custom branded documents." />}
    </div>
  );
}

function SignatureLibrary() {
  const { user } = useAuth();
  const certificates = useDocumentStore((state) => state.certificates.filter((certificate) => certificate.userId === user?.id));
  return (
    <div className="de-panel">
      <h2>Digital Certificates</h2>
      {certificates.length ? certificates.map((certificate) => (
        <div className="de-table-row" key={certificate.id}>
          <div><strong>{certificate.subject}</strong><span>{certificate.issuer} - expires {certificate.expires ?? "not provided"}</span></div>
        </div>
      )) : <EmptyState text="Validated certificate metadata appears here. Passwords are never stored." />}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="de-empty">{text}</div>;
}

function titleFor(view: WorkspaceView) {
  const titles: Record<WorkspaceView, string> = {
    overview: "Document Command Center",
    create: "Create Document",
    review: "Review Draft",
    preview: "Preview Document",
    sign: "Sign Document",
    history: "Version History",
    documents: "My Documents",
    templates: "Templates",
    branding: "Branding",
    signatures: "Digital Signatures",
  };
  return titles[view];
}

function subtitleFor(view: WorkspaceView) {
  const subtitles: Record<WorkspaceView, string> = {
    overview: "Draft, brand, review, sign, and download legal documents from the same Turn2Law dashboard.",
    create: "Choose a template, provide matter details, apply branding, and generate a PDF.",
    review: "Check the current draft state before producing the next version.",
    preview: "Inspect generated PDFs and download unsigned or signed files.",
    sign: "Validate a certificate, place a visible signature through the backend, and download the signed PDF.",
    history: "Every successful generation creates a reopenable version.",
    documents: "All generated documents associated with your active Turn2Law session.",
    templates: "Official Doc Engine templates powered by the FastAPI schema engine.",
    branding: "Workspace-level Turn2Law, advanced branding, and complete letterhead assets.",
    signatures: "Certificate metadata for validated digital-signature workflows.",
  };
  return subtitles[view];
}

function buildDocumentName(typeName: string, fields: Record<string, string>) {
  const subject =
    fields.Name ??
    fields.Employee_Name ??
    fields.Client_Name ??
    fields.PartyA_Name ??
    fields.Company ??
    "Untitled";
  return `${typeName} - ${subject}`;
}

function cleanError(error: string) {
  if (error.includes("\\") || error.includes("Traceback")) {
    return "The document engine could not complete this request. Check the uploaded files and required fields, then try again.";
  }
  return error;
}
