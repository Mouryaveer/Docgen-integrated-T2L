"use client";

import React from "react";

export default function DocEngineFlow() {
  return (
    <section id="how" className="pad">
      <div className="wrap">
        <div className="sec-head" style={{ maxWidth: "720px" }}>
          <span className="eyebrow reveal">From plain language to signed document</span>
          <h2 className="h2 reveal" style={{ "--d": "80ms" } as React.CSSProperties}>
            Six steps. Minutes, not weeks.
          </h2>
        </div>
        <div className="de-panel reveal">
          <div className="nglow">
            <svg>
              <use href="#nmark"></use>
            </svg>
          </div>
          <div
            className="mono"
            style={{
              fontSize: "10.5px",
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "22px",
              position: "relative",
              zIndex: 1,
            }}
          >
            The drafting flow
          </div>
          <div className="flow">
            <div className="step">
              <div className="sn">STEP 01</div>
              <div className="st">Prompt</div>
              <div className="sd">
                Describe what you need in plain language. The engine shows what it understood before it drafts.
              </div>
            </div>
            <div className="step">
              <div className="sn">STEP 02</div>
              <div className="st">Confirm or guide</div>
              <div className="sd">
                Missing details are collected inline, or through a step-by-step Q&amp;A written for non-lawyers.
              </div>
            </div>
            <div className="step">
              <div className="sn">STEP 03</div>
              <div className="st">Generate</div>
              <div className="sd">
                Assembled from a versioned, India-specific clause library. The AI never free-writes statutory language.
              </div>
            </div>
            <div className="step">
              <div className="sn">STEP 04</div>
              <div className="st">Review</div>
              <div className="sd">
                Every clause carries a plain-language explainer. Anything one-sided is flagged with severity and a reason.
              </div>
            </div>
            <div className="step">
              <div className="sn">STEP 05</div>
              <div className="st">Decide</div>
              <div className="sd">
                Accept, edit clause by clause, or bring in a Turn2Law lawyer for a fixed-fee review.
              </div>
            </div>
            <div className="step">
              <div className="sn">STEP 06</div>
              <div className="st">Execute</div>
              <div className="sd">
                Sign online with a tamper-evident audit trail, export to PDF and DOCX. Versions kept forever.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
