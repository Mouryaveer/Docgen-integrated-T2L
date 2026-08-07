"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQCard from "../components/FAQCard";
import InteractiveCard from "../components/InteractiveCard";

interface Tier {
  name: string;
  price: string;
  billing: string;
  rec?: boolean;
  features: string[];
}

interface Entity {
  name: string;
  tiers: Tier[];
}

interface Service {
  code: string;
  name: string;
  icon: string;
  tags: string[];
  desc: string;
  tiers?: Tier[];
  entities?: Entity[];
  steps?: [string, string][];
  note?: string;
}

const ICONS: Record<string, React.ReactNode> = {
  building: (
    <>
      <path d="M4 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15"></path>
      <path d="M12 21V10a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v11"></path>
      <path d="M2 21h20"></path>
      <path d="M7 8h1M7 12h1M7 16h1M16 12h1M16 16h1"></path>
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="6"></circle>
      <path d="M8.2 13.9 7 23l5-3 5 3-1.2-9.1"></path>
    </>
  ),
  clipboard: (
    <>
      <path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"></path>
      <rect x="8" y="2" width="8" height="4" rx="1"></rect>
      <path d="m9 14 2 2 4-4"></path>
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
      <path d="M16 2v4M8 2v4M3 10h18"></path>
    </>
  ),
  trending: (
    <>
      <path d="M23 6 13.5 15.5l-5-5L1 18"></path>
      <path d="M17 6h6v6"></path>
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </>
  ),
  dispute: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </>
  )
};

const SERVICES: Service[] = [
  {
    code: "01 · Incorporation",
    name: "Company incorporation",
    icon: "building",
    tags: ["PVT LTD", "OPC", "LLP", "SECTION 8"],
    desc: "Private Limited, OPC, LLP, Section 8, and conversions, with the whole process visible before you pay. Pricing below is exactly what you see at checkout, entity by entity.",
    entities: [
      {
        name: "Private Limited",
        tiers: [
          { name: "Basic", price: "₹14,999", billing: "one-time", features: ["DSC for 2 directors", "DIN for 2 directors", "Name approval (RUN)", "MOA & AOA drafting", "Incorporation certificate", "Company PAN & TAN"] },
          { name: "Standard", price: "₹19,999", billing: "one-time", rec: true, features: ["Everything in Basic", "Current bank account", "GST registration", "Commencement certificate", "Share certificates", "Priority support"] },
          { name: "Premium", price: "₹29,999", billing: "one-time", features: ["Everything in Standard", "MSME / Udyam registration", "Trademark registration", "ESI & PF registration", "Professional tax", "Dedicated account manager"] }
        ]
      },
      {
        name: "OPC",
        tiers: [
          { name: "Basic", price: "₹12,999", billing: "one-time", features: ["DSC for director", "DIN for director", "Name approval", "MOA & AOA", "Incorporation certificate", "PAN & TAN"] },
          { name: "Standard", price: "₹17,999", billing: "one-time", rec: true, features: ["Everything in Basic", "Bank account", "GST registration", "Share certificate", "Priority support"] },
          { name: "Premium", price: "₹24,999", billing: "one-time", features: ["Everything in Standard", "MSME registration", "Trademark filing", "Tax consultation", "Account manager"] }
        ]
      },
      {
        name: "LLP",
        tiers: [
          { name: "Basic", price: "₹11,999", billing: "one-time", features: ["DSC for 2 partners", "DIN for designated partners", "Name approval", "LLP agreement drafting", "LLP registration", "PAN & TAN"] },
          { name: "Standard", price: "₹16,999", billing: "one-time", rec: true, features: ["Everything in Basic", "Bank account assistance", "GST registration", "Certificate of incorporation", "Priority support"] },
          { name: "Premium", price: "₹23,999", billing: "one-time", features: ["Everything in Standard", "MSME registration", "Trademark filing", "Legal consultation", "Dedicated manager"] }
        ]
      },
      {
        name: "Section 8",
        tiers: [
          { name: "Basic", price: "₹16,999", billing: "one-time", features: ["DSC for 2 directors", "DIN for 2 directors", "Name approval", "MOA & AOA (non-profit clauses)", "Section 8 licence & incorporation", "PAN & TAN"] },
          { name: "Standard", price: "₹22,999", billing: "one-time", rec: true, features: ["Everything in Basic", "12A & 80G groundwork", "Bank account", "Priority support"] },
          { name: "Premium", price: "₹32,999", billing: "one-time", features: ["Everything in Standard", "FCRA readiness review", "Dedicated account manager", "Annual compliance briefing"] }
        ]
      }
    ],
    steps: [
      ["01", "Obtain digital signatures and Director Identification Numbers for all directors or partners."],
      ["02", "Reserve your entity name through the RUN / name-approval service."],
      ["03", "File the incorporation form with drafted MOA / AOA or partnership agreement."],
      ["04", "The registrar verifies documents; any query is relayed to you in plain language."],
      ["05", "Receive your incorporation certificate, PAN, and TAN."],
      ["06", "Open a current account and your compliance calendar switches on."]
    ],
    note: "No minimum capital required. Private Limited needs at least 2 directors (max 15); OPC needs 1; LLPs and Partnerships need at least 2 partners."
  },
  {
    code: "02 · Trademark & IP",
    name: "Trademark and IP",
    icon: "award",
    tags: ["SEARCH", "FILING", "OPPOSITION", "COPYRIGHT"],
    desc: "Search, filing, opposition, renewal, copyright, and patent assistance, handled by the bench. Government fees are billed at actuals on top of the professional fee below.",
    tiers: [
      { name: "Search & file", price: "₹4,999", billing: "+ govt fee", features: ["Comprehensive trademark search", "Filing in one class", "Applicant-type fee guidance", "Application tracking"] },
      { name: "Filing & defence", price: "₹9,999", billing: "+ govt fee", rec: true, features: ["Everything in Search & file", "Examination report response", "Opposition reply drafting", "Hearing brief preparation"] },
      { name: "Full IP cover", price: "₹18,999", billing: "+ govt fee", features: ["Everything in Filing & defence", "Copyright registration (1 work)", "Renewal reminders for 10 years", "Dedicated IP counsel"] }
    ],
    steps: [
      ["01", "A comprehensive search across classes to flag conflicting marks before you file."],
      ["02", "Filing with the Trademark Registry under the correct class and applicant type."],
      ["03", "Examination report, if raised, is answered by the bench within the statutory window."],
      ["04", "Opposition, if filed by a third party, is defended with a counter-statement and evidence."],
      ["05", "Registration certificate issues; renewal reminders are set for year nine."]
    ],
    note: "Government e-filing fee is ₹4,500 per class for individuals, startups, and MSMEs, and ₹9,000 per class for other applicants, billed at actuals."
  },
  {
    code: "03 · Registrations",
    name: "Business registrations",
    icon: "clipboard",
    tags: ["GST", "MSME", "IEC", "FSSAI", "SHOPS"],
    desc: "The registrations a running business collects, done once and done right. Pricing is per registration; ask about bundle discounts when ordered together.",
    entities: [
      {
        name: "GST",
        tiers: [
          { name: "Basic", price: "₹2,999", billing: "one-time", features: ["GST registration filing", "GSTIN certificate", "Filing assistance", "Expert guidance", "Email support"] },
          { name: "Standard", price: "₹4,999", billing: "one-time", rec: true, features: ["Everything in Basic", "Return filing (3 months)", "Invoice generation tool", "Priority support", "Compliance calendar"] },
          { name: "Premium", price: "₹9,999", billing: "one-time", features: ["Everything in Standard", "Annual return filing", "Tax planning session", "Dedicated CA", "Audit support"] }
        ]
      },
      {
        name: "IEC",
        tiers: [
          { name: "Basic", price: "₹2,999", billing: "one-time", features: ["IEC number registration", "Document preparation", "Application filing", "Certificate delivery"] },
          { name: "Standard", price: "₹4,999", billing: "one-time", rec: true, features: ["Everything in Basic", "Priority processing", "PAN–IEC linking", "Compliance checklist", "Dedicated support"] },
          { name: "Premium", price: "₹7,999", billing: "one-time", features: ["Everything in Standard", "Post-registration guidance", "Export compliance training", "Legal consultation (2 sessions)", "Dedicated account manager"] }
        ]
      },
      {
        name: "MSME / Udyam",
        tiers: [
          { name: "Assisted filing", price: "₹1,499", billing: "one-time", rec: true, features: ["Udyam registration filing", "Certificate delivery", "Investment & turnover classification check", "Email support"] }
        ]
      },
      {
        name: "FSSAI",
        tiers: [
          { name: "Basic registration", price: "₹2,999", billing: "+ govt fee", rec: true, features: ["Eligibility check (basic / state / central)", "Application filing", "Document preparation", "Certificate delivery"] }
        ]
      },
      {
        name: "Shops & Establishment",
        tiers: [
          { name: "Assisted filing", price: "₹1,999", billing: "+ govt fee", rec: true, features: ["State-specific application filing", "Document preparation", "Certificate delivery"] }
        ]
      }
    ],
    steps: [
      ["01", "Tell us which registrations your business needs; we confirm documents and fees upfront."],
      ["02", "Our team prepares and files each application with the relevant authority."],
      ["03", "Queries from the department, if any, are handled and relayed to you."],
      ["04", "Certificates land in your locker as each registration is approved."]
    ]
  },
  {
    code: "04 · ROC compliance",
    name: "ROC and annual compliance",
    icon: "calendar",
    tags: ["AOC-4", "MGT-7", "DIR-3 KYC", "REGISTERS"],
    desc: "Annual filings, resolutions, registers, and AGM paperwork on a calendar that cannot miss a date.",
    tiers: [
      { name: "Annual compliance", price: "₹18,000", billing: "/ year", rec: true, features: ["AOC-4 and MGT-7 annual filings", "DIR-3 KYC for all directors", "Statutory registers maintained", "Board & AGM minutes drafted", "Compliance calendar with WhatsApp reminders"] }
    ],
    steps: [
      ["01", "Your compliance calendar switches on the moment incorporation completes."],
      ["02", "Reminders land on email and WhatsApp before every statutory deadline."],
      ["03", "Filings are prepared, shared for your sign-off, and filed with the ROC."],
      ["04", "Registers and minutes are kept current and stored in your locker."]
    ],
    note: "Covers one financial year for a single company with standard filings. Event-based filings (share transfers, charge creation, director changes) are quoted separately."
  },
  {
    code: "05 · Fundraising",
    name: "Fundraising advisory",
    icon: "trending",
    tags: ["ESOP", "CAP TABLE", "TERM SHEET", "FEMA"],
    desc: "ESOP schemes, cap tables, term sheets, and FEMA / RBI paperwork for your round, priced by deliverable so you know the cost before you commit.",
    tiers: [
      { name: "Term sheet review", price: "₹14,999", billing: "fixed fee", features: ["Clause-by-clause review", "Investor-friendliness flags", "One round of negotiation notes", "Turnaround in 3 business days"] },
      { name: "ESOP scheme", price: "₹24,999", billing: "fixed fee", rec: true, features: ["ESOP pool structuring", "Scheme drafting and board resolutions", "Cap table modelling", "Grant letter templates"] },
      { name: "Full round support", price: "Custom quote", billing: "engagement", features: ["Shareholders' agreement drafting", "FEMA / RBI filings (FC-GPR)", "Cap table and waterfall modelling", "Closing checklist management"] }
    ],
    steps: [
      ["01", "Share your term sheet or round structure; we scope the exact deliverables."],
      ["02", "Drafting and structuring work runs on a fixed-fee, fixed-timeline basis."],
      ["03", "FEMA / RBI filings are prepared and tracked to closing."],
      ["04", "Signed documents and filings land in your locker."]
    ]
  },
  {
    code: "06 · Employment & HR",
    name: "Employment and HR legal",
    icon: "users",
    tags: ["CONTRACTS", "POSH", "PF / ESI", "POLICIES"],
    desc: "Contracts, POSH compliance, PF and ESI, and policy manuals as you hire, so growth never outruns your paperwork.",
    tiers: [
      { name: "Contract pack", price: "₹2,999", billing: "per template", features: ["Employment agreement, role-specific", "Offer letter and NDA", "Plain-language explainer per clause"] },
      { name: "POSH compliance", price: "₹9,999", billing: "one-time", rec: true, features: ["POSH policy drafting", "Internal Committee (IC) constitution", "Employee awareness deck", "Annual report template"] },
      { name: "Full HR legal pack", price: "₹19,999", billing: "one-time", features: ["Everything in Contract pack and POSH", "PF & ESI registration guidance", "Employee handbook and policy manuals", "Priority support"] }
    ],
    steps: [
      ["01", "Tell us your headcount and hiring plan; we recommend the right pack."],
      ["02", "Contracts and policies are drafted from India-specific, versioned templates."],
      ["03", "POSH committee setup and registrations are handled end to end."],
      ["04", "Everything is stored in your locker, ready to send on day one."]
    ]
  },
  {
    code: "07 · Disputes",
    name: "Disputes and recovery",
    icon: "dispute",
    tags: ["NOTICES", "RECOVERY", "MEDIATION"],
    desc: "Legal notices, payment recovery, and mediation support, informational and clear.",
    tiers: [
      { name: "Legal notice", price: "₹2,999", billing: "per notice", features: ["Drafted by the bench", "Sent via registered post and email", "One round of revisions"] },
      { name: "Payment recovery", price: "₹4,999", billing: "starting", rec: true, features: ["Demand notice drafting and dispatch", "Structured follow-up cadence", "Settlement negotiation support"] },
      { name: "Mediation support", price: "Custom quote", billing: "engagement", features: ["Mediation-readiness review", "Documentation and evidence organisation", "Referral to empanelled mediators"] }
    ],
    steps: [
      ["01", "Describe the dispute; we confirm scope, documents needed, and cost."],
      ["02", "Notices are drafted, reviewed with you, and dispatched."],
      ["03", "Follow-up and negotiation are tracked with visible status."],
      ["04", "For matters needing representation, we refer you to empanelled counsel."]
    ],
    note: "Turn2Law is a technology platform, not a law firm, and does not provide courtroom representation."
  },
  {
    code: "08 · Virtual GC",
    name: "Virtual general counsel",
    icon: "shield",
    tags: ["RETAINER", "PRIORITY SLA", "MONTHLY"],
    desc: "A monthly retainer: your request queue, priority SLAs, one bench behind it, for teams that need ongoing legal support without a full-time hire.",
    tiers: [
      { name: "Starter", price: "₹14,999", billing: "/ month", features: ["Up to 5 requests / month", "48-hour turnaround SLA", "Contract review and redlines", "Email support"] },
      { name: "Growth", price: "₹29,999", billing: "/ month", rec: true, features: ["Up to 12 requests / month", "24-hour turnaround SLA", "Contract review, policy drafting, notices", "Priority support channel"] },
      { name: "Scale", price: "₹49,999", billing: "/ month", features: ["Unlimited standard requests", "Same-day turnaround SLA", "Named lead counsel", "Quarterly legal health review"] }
    ],
    steps: [
      ["01", "Pick a tier based on your monthly request volume."],
      ["02", "Requests are logged in a shared queue with visible status and owners."],
      ["03", "The bench works to your SLA; escalations are flagged, not buried in email."],
      ["04", "A quarterly review keeps the retainer scoped to what you actually need."]
    ]
  }
];

export default function LegalServices() {
  const [showToTop, setShowToTop] = useState(false);
  const [activeSvcIndex, setActiveSvcIndex] = useState<number | null>(null);
  const [activeEntityIndex, setActiveEntityIndex] = useState<number>(0);

  // Monitor scroll for back-to-top FAB
  useEffect(() => {
    const handleScroll = () => {
      setShowToTop(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync menuOpen/modalOpen state to body scroll lock
  useEffect(() => {
    if (activeSvcIndex !== null) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [activeSvcIndex]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeSvcIndex !== null) {
        setActiveSvcIndex(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSvcIndex]);

  // Reveal animations setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const elements = document.querySelectorAll(".reveal:not(.in)");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const openServiceModal = (index: number) => {
    setActiveSvcIndex(index);
    setActiveEntityIndex(0);
  };

  const currentService = activeSvcIndex !== null ? SERVICES[activeSvcIndex] : null;

  return (
    <div className="legal-services-theme">
      {/* Reusable SVG Symbol for N-Glow */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="nmark" viewBox="0 0 96 118">
          <g fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 108 V26 L70 100 V34"></path>
            <path d="M49 44 L70 18 L91 44"></path>
          </g>
        </symbol>
      </svg>

      <Navbar />

      <main id="top">
        {/* ================= HERO ================= */}
        <section className="phero">
          <div className="nglow">
            <svg><use href="#nmark"></use></svg>
          </div>
          <div className="wrap">
            <div className="phero-inner center">
              <div className="crumb reveal">
                <Link href="/">Home</Link>
                <span>/</span>
                <span>Legal Services</span>
              </div>
              <h1 className="reveal" style={{ "--d": "80ms" } as React.CSSProperties}>
                Done right,<br />not just <span className="g">fast.</span>
              </h1>
              <p className="lede reveal" style={{ "--d": "140ms" } as React.CSSProperties}>
                Human-delivered legal, compliance, and IP work, sold and tracked like a modern product. Every service page says exactly what happens, when, and what it costs.
              </p>
              <div className="phero-ctas reveal" style={{ "--d": "200ms" } as React.CSSProperties}>
                <a href="#services" className="btn btn-gold">See the catalogue</a>
                <a href="#pricing" className="btn btn-ghost">View pricing</a>
              </div>
            </div>

            {/* Interactive Process / Journey Mockup */}
            <div className="journey reveal" style={{ "--d": "240ms" } as React.CSSProperties}>
              <InteractiveCard className="jcard">
                <div className="orb"></div>
                <div className="jc-step">STAGE 01</div>
                <div className="jc-title">
                  Start it
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
                </div>
                <p className="jc-desc">Incorporate your company, register for GST, open a current account, and get share certificates, end-to-end.</p>
                <div className="jc-mock">
                  <div className="jc-mrow">
                    <div className="jc-mico">
                      <svg viewBox="0 0 24 24"><path d="M4 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15"></path></svg>
                    </div>
                    <div>
                      <div className="jc-mt">PVT LTD Company</div>
                      <div className="jc-ms">Filing in progress · MCA</div>
                    </div>
                    <div className="jc-check">✓</div>
                  </div>
                  <div className="jc-mbar"><span></span></div>
                  <div className="jc-mtag">
                    <span className="lab">Statutory fee</span>
                    <b>₹14,999</b>
                  </div>
                </div>
              </InteractiveCard>

              <InteractiveCard className="jcard">
                <div className="orb"></div>
                <div className="jc-step">STAGE 02</div>
                <div className="jc-title">
                  Manage it
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
                </div>
                <p className="jc-desc">File annual returns, maintain registers, constitution board resolutions, and handle event-based compliance.</p>
                <div className="jc-mock">
                  <div className="jc-mrow">
                    <div className="jc-mico">
                      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"></rect></svg>
                    </div>
                    <div>
                      <div className="jc-mt">MGT-7 Annual Return</div>
                      <div className="jc-ms">Due in 14 days</div>
                    </div>
                    <div className="jc-check" style={{ background: "var(--navy)", color: "var(--gold)" }}>!</div>
                  </div>
                  <div className="jc-mbar"><span style={{ width: "80%" }}></span></div>
                  <div className="jc-mtag">
                    <span className="lab">Annual retainer</span>
                    <b>₹18,000<span style={{ fontSize: "11px", color: "var(--gray)", fontWeight: "normal" }}>/yr</span></b>
                  </div>
                </div>
              </InteractiveCard>

              <InteractiveCard className="jcard">
                <div className="orb"></div>
                <div className="jc-step">STAGE 03</div>
                <div className="jc-title">
                  Protect it
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
                </div>
                <p className="jc-desc">Search and register trademarks, draft custom customer agreements, constitution ESOP pools, and handle disputes.</p>
                <div className="jc-mock">
                  <div className="jc-mrow">
                    <div className="jc-mico">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"></circle></svg>
                    </div>
                    <div>
                      <div className="jc-mt">Trademark Search</div>
                      <div className="jc-ms">0 conflicts found in Class 42</div>
                    </div>
                    <div className="jc-check">✓</div>
                  </div>
                  <div className="jc-mbar"><span style={{ width: "100%" }}></span></div>
                  <div className="jc-mtag">
                    <span className="lab">Filing fee</span>
                    <b>₹4,999</b>
                  </div>
                </div>
              </InteractiveCard>
            </div>
          </div>
        </section>

        {/* ================= SERVICE CATALOGUE ================= */}
        <section id="services" className="pad">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow reveal">The service catalogue</span>
              <h2 className="h2 reveal" style={{ "--d": "80ms" } as React.CSSProperties}>Every legal service a company needs.</h2>
              <p className="lede reveal" style={{ "--d": "140ms" } as React.CSSProperties}>
                Human-delivered legal, compliance, and IP work, sold and tracked like a modern product. Click any service below for its full pricing and process details.
              </p>
            </div>

            <div className="cat-grid">
              {SERVICES.map((svc, i) => (
                <div 
                  key={i}
                  className="cat reveal"
                  style={{ "--d": `${i * 40}ms` } as React.CSSProperties}
                  onClick={() => openServiceModal(i)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openServiceModal(i);
                    }
                  }}
                >
                  <div className="cat-ico">
                    <svg viewBox="0 0 24 24">{ICONS[svc.icon]}</svg>
                  </div>
                  <div className="cc">{svc.code}</div>
                  <div className="cn">{svc.name}</div>
                  <div className="cb">{svc.desc.substring(0, 100)}...</div>
                  <div className="ct">{svc.tags.join(" · ")}</div>
                  <span className="cat-more">
                    View pricing &amp; details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PILLAR spotlight ================= */}
        <section className="pad-t">
          <div className="wrap">
            <div className="split">
              <div>
                <span className="kicker reveal" style={{ color: "var(--gold-deep)" }}>Pillar 01 · Legal Services</span>
                <h2 className="h2 reveal" style={{ "--d": "80ms", margin: "16px 0 18px" } as React.CSSProperties}>
                  Done right,<br />not just fast.
                </h2>
                <p className="lede reveal" style={{ "--d": "140ms" } as React.CSSProperties}>
                  Human-delivered legal, compliance, and IP work, sold and tracked like a modern product. Every service page says exactly what happens, when, and what it costs.
                </p>
                <ul className="deep-list reveal" style={{ "--d": "200ms" } as React.CSSProperties}>
                  <li>
                    <span className="n">01</span>
                    <div>
                      <b>Incorporation, done right</b>
                      <p>Private Limited, OPC, LLP, and Section 8, with the whole process visible before you pay.</p>
                    </div>
                  </li>
                  <li>
                    <span className="n">02</span>
                    <div>
                      <b>ROC and GST, never missed</b>
                      <p>Annual filings, resolutions, and registers on a calendar that cannot slip.</p>
                    </div>
                  </li>
                  <li>
                    <span className="n">03</span>
                    <div>
                      <b>An in-house bench</b>
                      <p>Lawyers, CAs, and CS professionals on one platform, with a named owner per matter.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="reveal" style={{ "--d": "160ms" } as React.CSSProperties}>
                <div className="glasscard" style={{ position: "relative", padding: "26px", background: "var(--bg-tint)", boxShadow: "var(--shadow-md)" }}>
                  <div className="k mono" style={{ fontSize: "10px", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gray)", marginBottom: "18px" }}>
                    Order · Received → Delivered
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div style={{ display: "flex", gap: "14px", padding: "12px 0" }}>
                      <div style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-dm-mono), monospace", fontSize: "10px", fontWeight: 500, background: "var(--gold)", color: "#111" }}>✓</div>
                      <div>
                        <div style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 600, fontSize: "14px" }}>Received</div>
                        <div style={{ fontSize: "12px", color: "var(--gray)", lineHeight: 1.5 }}>Your order and matter are created; an invoice is issued within two minutes.</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "14px", padding: "12px 0", borderTop: "1px solid var(--line)" }}>
                      <div style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-dm-mono), monospace", fontSize: "10px", fontWeight: 500, background: "var(--gold)", color: "#111" }}>✓</div>
                      <div>
                        <div style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 600, fontSize: "14px" }}>Documents verified</div>
                        <div style={{ fontSize: "12px", color: "var(--gray)", lineHeight: 1.5 }}>Each KYC item shows its status with a reason in plain language.</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "14px", padding: "12px 0", borderTop: "1px solid var(--line)" }}>
                      <div style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-dm-mono), monospace", fontSize: "10px", fontWeight: 500, background: "var(--bg)", border: "1px solid var(--line)", color: "var(--gray)" }}>3</div>
                      <div>
                        <div style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 600, fontSize: "14px" }}>Filed</div>
                        <div style={{ fontSize: "12px", color: "var(--gray)", lineHeight: 1.5 }}>Your assigned professional files with the MCA; you see who owns it.</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "14px", padding: "12px 0", borderTop: "1px solid var(--line)" }}>
                      <div style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-dm-mono), monospace", fontSize: "10px", fontWeight: 500, background: "var(--bg)", border: "1px solid var(--line)", color: "var(--gray)" }}>4</div>
                      <div>
                        <div style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 600, fontSize: "14px" }}>Government processing</div>
                        <div style={{ fontSize: "12px", color: "var(--gray)", lineHeight: 1.5 }}>We track the registrar so you do not have to; blockers are named.</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "14px", padding: "12px 0", borderTop: "1px solid var(--line)" }}>
                      <div style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-dm-mono), monospace", fontSize: "10px", fontWeight: 500, background: "var(--bg)", border: "1px solid var(--line)", color: "var(--gray)" }}>5</div>
                      <div>
                        <div style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 600, fontSize: "14px" }}>Approved</div>
                        <div style={{ fontSize: "12px", color: "var(--gray)", lineHeight: 1.5 }}>Approval lands; deliverables are prepared for your locker.</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "14px", padding: "12px 0", borderTop: "1px solid var(--line)" }}>
                      <div style={{ flex: "none", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-dm-mono), monospace", fontSize: "10px", fontWeight: 500, background: "var(--bg)", border: "1px solid var(--line)", color: "var(--gray)" }}>6</div>
                      <div>
                        <div style={{ fontFamily: "var(--font-poppins), sans-serif", fontWeight: 600, fontSize: "14px" }}>Delivered</div>
                        <div style={{ fontSize: "12px", color: "var(--gray)", lineHeight: 1.5 }}>Everything in your locker, and your compliance calendar switches on.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STRUCTURE RECOMMENDATIONS ================= */}
        <section className="pad-t">
          <div className="wrap">
            <div className="sec-head center">
              <span className="eyebrow center reveal">Start your business</span>
              <h2 className="h2 reveal" style={{ "--d": "80ms" } as React.CSSProperties}>Pick the right structure.</h2>
              <p className="lede reveal" style={{ "--d": "140ms" } as React.CSSProperties}>
                Four ways to incorporate in India. We help you choose, then handle the filing end to end.
              </p>
            </div>

            <div className="ent-grid">
              <div className="ent reveal">
                <div className="ek">Most popular</div>
                <h3>Private Limited</h3>
                <p>Best for startups raising capital and issuing ESOPs.</p>
                <ul>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5"></path></svg>Separate legal entity</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5"></path></svg>Equity and ESOP ready</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5"></path></svg>Preferred by investors</li>
                </ul>
              </div>

              <div className="ent reveal">
                <div className="ek">Solo founder</div>
                <h3>OPC</h3>
                <p>One person company for a single founder who wants limited liability.</p>
                <ul>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5"></path></svg>One shareholder</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5"></path></svg>Limited liability</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5"></path></svg>Lower compliance load</li>
                </ul>
              </div>

              <div className="ent reveal">
                <div className="ek">Partners</div>
                <h3>LLP</h3>
                <p>Limited liability partnership for services firms and small teams.</p>
                <ul>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5"></path></svg>Partner liability capped</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5"></path></svg>Flexible profit share</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5"></path></svg>Fewer filings than Pvt Ltd</li>
                </ul>
              </div>

              <div className="ent reveal">
                <div className="ek">Non-profit</div>
                <h3>Section 8</h3>
                <p>For mission-driven organisations and foundations.</p>
                <ul>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5"></path></svg>Non-profit status</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5"></path></svg>Tax benefits eligible</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5"></path></svg>Grant and CSR ready</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PRICING ================= */}
        <section id="pricing" className="pad-t">
          <div className="wrap">
            <div className="sec-head center">
              <span className="eyebrow center reveal">Pricing</span>
              <h2 className="h2 reveal" style={{ "--d": "80ms" } as React.CSSProperties}>What it costs, on the page.</h2>
              <p className="lede reveal" style={{ "--d": "140ms" } as React.CSSProperties}>
                Transparent, all-inclusive fees. No quotes-on-request for standard work. Government fees where applicable are billed at actuals.
              </p>
            </div>

            <div className="mono reveal" style={{ fontSize: "10.5px", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gray)", margin: "8px 0 20px" }}>
              Company formation · Private Limited Company
            </div>

            <div className="price-grid">
              <div className="price reveal">
                <div className="k">Basic</div>
                <div className="amt">₹14,999<small>one-time</small></div>
                <div className="sub">Everything you need to incorporate</div>
                <ul>
                  <li>DSC and DIN for 2 directors</li>
                  <li>Name approval (RUN) and MOA / AOA drafting</li>
                  <li>Company incorporation certificate</li>
                  <li>Company PAN and TAN</li>
                </ul>
                <a href="#contact" className="pbtn">Get started</a>
              </div>

              <div className="price feat reveal" style={{ "--d": "100ms" } as React.CSSProperties}>
                <div className="badge">Recommended</div>
                <div className="k">Standard</div>
                <div className="amt">₹19,999<small>one-time</small></div>
                <div className="sub">Incorporate and start operating</div>
                <ul>
                  <li>Everything in Basic</li>
                  <li>Current bank account and GST registration</li>
                  <li>Commencement certificate and share certificates</li>
                  <li>Priority support</li>
                </ul>
                <a href="#contact" className="pbtn">Get started</a>
              </div>

              <div className="price reveal" style={{ "--d": "200ms" } as React.CSSProperties}>
                <div className="k">Premium</div>
                <div className="amt">₹29,999<small>one-time</small></div>
                <div className="sub">Incorporate, protect, and stay compliant</div>
                <ul>
                  <li>Everything in Standard</li>
                  <li>MSME / Udyam and Trademark registration</li>
                  <li>ESI, PF, and Professional Tax</li>
                  <li>Dedicated account manager</li>
                </ul>
                <a href="#contact" className="pbtn">Get started</a>
              </div>
            </div>

            <div className="mono reveal" style={{ fontSize: "10.5px", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gray)", margin: "44px 0 20px" }}>
              More services · starting prices
            </div>

            <div className="pmini">
              <div className="pm reveal">
                <div className="pmk">One Person Company</div>
                <div className="pmv">₹12,999<small> one-time</small></div>
                <div className="pmn">Basic plan. Standard and Premium available.</div>
              </div>
              <div className="pm reveal" style={{ "--d": "70ms" } as React.CSSProperties}>
                <div className="pmk">Limited Liability Partnership</div>
                <div className="pmv">₹11,999<small> one-time</small></div>
                <div className="pmn">Basic plan. Standard and Premium available.</div>
              </div>
              <div className="pm reveal" style={{ "--d": "140ms" } as React.CSSProperties}>
                <div className="pmk">Partnership Firm</div>
                <div className="pmv">₹8,999<small> one-time</small></div>
                <div className="pmn">Basic plan. Standard and Premium available.</div>
              </div>
              <div className="pm reveal">
                <div className="pmk">GST Registration</div>
                <div className="pmv">₹2,999<small> one-time</small></div>
                <div className="pmn">Basic plan. Return-filing plans from ₹999 / month.</div>
              </div>
              <div className="pm reveal" style={{ "--d": "70ms" } as React.CSSProperties}>
                <div className="pmk">Import Export Code</div>
                <div className="pmv">₹2,999<small> one-time</small></div>
                <div className="pmn">Basic plan, lifetime validity.</div>
              </div>
              <div className="pm reveal" style={{ "--d": "140ms" } as React.CSSProperties}>
                <div className="pmk">ROC annual compliance</div>
                <div className="pmv">₹18,000<small> / year</small></div>
                <div className="pmn">AOC-4, MGT-7, DIR-3 KYC, registers, and calendar.</div>
              </div>
            </div>

            <div className="price-foot reveal">
              All-inclusive of professional fees. Government and statutory fees billed at actuals. No GSTIN appears until registration is active.
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="pad-t">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow reveal">How it works</span>
              <h2 className="h2 reveal" style={{ "--d": "80ms" } as React.CSSProperties}>From order to delivered, in the open.</h2>
            </div>
            <div className="steps">
              <div className="pstep reveal">
                <div className="pic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="14 3 14 9 20 9"></polyline>
                  </svg>
                </div>
                <div className="pn">STEP 01</div>
                <h3>Tell us what you need</h3>
                <p>Pick a service or describe your matter. You see the scope, the documents required, and the price before anything begins.</p>
              </div>

              <div className="pstep reveal">
                <div className="pic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4"></path>
                    <circle cx="12" cy="12" r="9"></circle>
                  </svg>
                </div>
                <div className="pn">STEP 02</div>
                <h3>We verify and file</h3>
                <p>Your assigned professional collects KYC, prepares the paperwork, and files with the MCA or the relevant authority.</p>
              </div>

              <div className="pstep reveal">
                <div className="pic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.7 21a2 2 0 0 1-3.4 0"></path>
                  </svg>
                </div>
                <div className="pn">STEP 03</div>
                <h3>Track to delivered</h3>
                <p>Every stage is visible live with a named owner. Deliverables land in your locker and your compliance calendar switches on.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY T2L ================= */}
        <section className="pad-t">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow reveal">Why Turn2Law</span>
              <h2 className="h2 reveal" style={{ "--d": "80ms" } as React.CSSProperties}>Traditional legal services, rebuilt.</h2>
            </div>
            <div className="cmp-wrap reveal">
              <table className="cmp">
                <thead>
                  <tr>
                    <th>Dimension</th>
                    <th>Traditional</th>
                    <th className="hl">Turn2Law</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Access</td>
                    <td>Referral-driven, office hours</td>
                    <td className="t2l">One platform, wherever you are</td>
                  </tr>
                  <tr>
                    <td>Cost</td>
                    <td>High retainers from day one</td>
                    <td className="t2l">Per-service and subscription tiers</td>
                  </tr>
                  <tr>
                    <td>Speed</td>
                    <td>Days to weeks for a first draft</td>
                    <td className="t2l">Services on defined timelines</td>
                  </tr>
                  <tr>
                    <td>Tracking</td>
                    <td>Email chains and phone tag</td>
                    <td className="t2l">Live status, a named owner per matter</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}
        <section className="pad-t">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow reveal">What founders say</span>
              <h2 className="h2 reveal" style={{ "--d": "80ms" } as React.CSSProperties}>Trusted by teams building fast.</h2>
            </div>
            <div className="tstat">
              <div className="tcell reveal">
                <div className="qm">&ldquo;</div>
                <p className="q">Turn2Law incorporated us in eleven days flat, every stage visible, no chasing anyone on email. It felt like software, not a law firm.</p>
                <div className="who">
                  <div className="av">AR</div>
                  <div>
                    <div className="nm">Ananya Rao</div>
                    <div className="rl">Founder · ICEBRKR</div>
                  </div>
                </div>
              </div>

              <div className="tcell reveal">
                <div className="qm">&ldquo;</div>
                <p className="q">The compliance calendar caught an MGT-7 deadline we would have missed. That single reminder more than paid for the platform.</p>
                <div className="who">
                  <div className="av">SN</div>
                  <div>
                    <div className="nm">Sara Nair</div>
                    <div className="rl">Founder · Serene Neurotech</div>
                  </div>
                </div>
              </div>

              <div className="tcell reveal">
                <div className="qm">&ldquo;</div>
                <p className="q">One platform for incorporation, contracts, and compliance. Genuinely the legal ops layer for our whole company.</p>
                <div className="who">
                  <div className="av">IS</div>
                  <div>
                    <div className="nm">Ishaan Sharma</div>
                    <div className="rl">Founder · Motioncomm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section id="faq" className="pad-t">
          <div className="wrap">
            <div className="sec-head center">
              <span className="eyebrow center reveal">Frequently asked</span>
              <h2 className="h2 reveal" style={{ "--d": "80ms", margin: "18px 0 18px" } as React.CSSProperties}>Questions, answered.</h2>
            </div>
            
            <div className="faq">
              <FAQCard 
                question="Which company structure should I choose?"
                answer="Most funded startups incorporate as a Private Limited company because it is equity and ESOP ready and preferred by investors. Solo founders often pick an OPC, services firms an LLP, and non-profits a Section 8 company. We help you decide before filing."
                defaultOpen={true}
              />
              <FAQCard 
                question="How long does incorporation take?"
                answer="Timelines depend on name approval and government processing, but the whole process is visible before you pay and tracked live with a named owner. Early clients have been incorporated in under two weeks."
              />
              <FAQCard 
                question="What is included in ROC annual compliance?"
                answer="The confirmed package at ₹18,000 per year covers AOC-4 and MGT-7 annual filings, DIR-3 KYC, statutory registers, board minutes, and a compliance calendar with reminders on email and WhatsApp."
              />
              <FAQCard 
                question="Who actually does the work?"
                answer="An in-house bench of lawyers, CAs, and CS professionals, with a named owner on every matter. Turn2Law is a technology platform, not a law firm, and does not provide courtroom representation."
              />
              <FAQCard 
                question="When will a GSTIN appear on invoices?"
                answer="GST registration is pending. No GSTIN is printed on any document until it is confirmed active."
              />
            </div>
          </div>
        </section>

        {/* ================= CTA BAND ================= */}
        <section className="pad-t">
          <div className="wrap">
            <div className="cta-band reveal">
              <div className="nglow"><svg><use href="#nmark"></use></svg></div>
              <h2>Start your company the right way.</h2>
              <p>Incorporation, registrations, and compliance on one platform, with a named owner at every stage.</p>
              <div className="btn-row">
                <a href="#contact" className="btn btn-gold">Get started</a>
                <a href="#contact" className="btn btn-ghost" style={{ background: "rgba(255,255,255,.08)", color: "#fff", borderColor: "rgba(255,255,255,.2)" }}>Talk to us</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Back to top FAB */}
      <button 
        className={`totop ${showToTop ? "show" : ""}`} 
        aria-label="Back to top"
        onClick={scrollToTop}
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 19V5M5 12l7-7 7 7"></path>
        </svg>
      </button>

      {/* Service catalogue detail overlay modal */}
      {currentService !== null && (
        <div className="svc-overlay open" role="dialog" aria-modal="true" onClick={() => setActiveSvcIndex(null)}>
          <div className="svc-panel" onClick={(e) => e.stopPropagation()}>
            <button className="svc-close" aria-label="Close" onClick={() => setActiveSvcIndex(null)}>
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"></path>
              </svg>
            </button>
            
            <div className="svc-head">
              <div className="nglow"><svg><use href="#nmark"></use></svg></div>
              <div className="svc-ico">
                <svg viewBox="0 0 24 24">{ICONS[currentService.icon]}</svg>
              </div>
              <div className="svc-code">{currentService.code}</div>
              <div className="svc-title">{currentService.name}</div>
              <div className="svc-tags">
                {currentService.tags.map((t, i) => (
                  <span key={i} className="chip"><i></i>{t}</span>
                ))}
              </div>
            </div>

            <div className="svc-body">
              <p className="svc-desc">{currentService.desc}</p>
              
              <div className="svc-sub">Pricing</div>
              
              {currentService.entities ? (
                <>
                  <div className="svc-tabs" role="tablist">
                    {currentService.entities.map((ent, idx) => (
                      <button
                        key={idx}
                        className={`svc-tab ${idx === activeEntityIndex ? "on" : ""}`}
                        onClick={() => setActiveEntityIndex(idx)}
                        role="tab"
                      >
                        {ent.name}
                      </button>
                    ))}
                  </div>

                  <div className="svc-tiers">
                    {currentService.entities[activeEntityIndex].tiers.map((tier, idx) => (
                      <div key={idx} className={`svc-tier ${tier.rec ? "rec" : ""}`}>
                        {tier.rec && <div className="stg">Recommended</div>}
                        <div className="stn">{tier.name}</div>
                        <div className="stp">
                          {tier.price}
                          <small>{tier.billing}</small>
                        </div>
                        <ul>
                          {tier.features.map((feat, fidx) => (
                            <li key={fidx}>{feat}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="svc-tiers">
                  {currentService.tiers?.map((tier, idx) => (
                    <div key={idx} className={`svc-tier ${tier.rec ? "rec" : ""}`}>
                      {tier.rec && <div className="stg">Recommended</div>}
                      <div className="stn">{tier.name}</div>
                      <div className="stp">
                        {tier.price}
                        <small>{tier.billing}</small>
                      </div>
                      <ul>
                        {tier.features.map((feat, fidx) => (
                          <li key={fidx}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {currentService.note && (
                <div className="svc-note">{currentService.note}</div>
              )}

              {currentService.steps && (
                <>
                  <div className="svc-sub">How it works</div>
                  <div className="svc-steps">
                    {currentService.steps.map((s, idx) => (
                      <div key={idx} className="svc-step">
                        <b>{s[0]}</b>
                        <div>{s[1]}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="svc-foot">
                <a href="#contact" className="btn btn-gold" onClick={() => setActiveSvcIndex(null)}>
                  Get started
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
                </a>
                <a href="#contact" className="btn btn-ghost" onClick={() => setActiveSvcIndex(null)}>Talk to us</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
