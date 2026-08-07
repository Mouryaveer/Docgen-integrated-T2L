"use client";

import React from "react";

export default function DocEngineFeatures() {
  return (
    <section className="pad-t">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow reveal">The intelligence layer</span>
          <h2 className="h2 reveal" style={{ "--d": "80ms" } as React.CSSProperties}>
            More than a template filler.
          </h2>
          <p className="lede reveal" style={{ "--d": "140ms" } as React.CSSProperties}>
            Doc Engine reads what it drafts. It flags risk, explains clauses in plain language, and keeps a full audit trail.
          </p>
        </div>
        <div className="fgrid">
          <div className="fcard reveal">
            <div className="fic">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
            <h3>AI risk flagging</h3>
            <p>
              Unusual or one-sided clauses are surfaced before a signature, not after, with a severity and a plain reason.
            </p>
            <div className="ftag">BEFORE YOU SIGN</div>
          </div>
          <div className="fcard reveal">
            <div className="fic">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <h3>Plain-language explainers</h3>
            <p>
              Every clause is paired with an explanation a non-lawyer can act on. No Latin without a translation.
            </p>
            <div className="ftag">EVERY CLAUSE</div>
          </div>
          <div className="fcard reveal">
            <div className="fic">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"></path>
              </svg>
            </div>
            <h3>Smart clause suggestions</h3>
            <p>
              Suggestions based on document type and party details, drawn from an India-specific library updated as law changes.
            </p>
            <div className="ftag">CONTEXT AWARE</div>
          </div>
          <div className="fcard reveal">
            <div className="fic">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>Multi-party review</h3>
            <p>
              Share, comment, and resolve with the other side in one flow, no email attachments ricocheting around.
            </p>
            <div className="ftag">COLLABORATE</div>
          </div>
          <div className="fcard reveal">
            <div className="fic">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
            </div>
            <h3>E-signature</h3>
            <p>
              Sign online with a tamper-evident audit trail. Executed versions lock automatically.
            </p>
            <div className="ftag">TAMPER-EVIDENT</div>
          </div>
          <div className="fcard reveal">
            <div className="fic">
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 2"></path>
              </svg>
            </div>
            <h3>Version history</h3>
            <p>
              Full version history and audit trail on every document, exportable to PDF and DOCX forever.
            </p>
            <div className="ftag">KEPT FOREVER</div>
          </div>
        </div>
      </div>
    </section>
  );
}
