"use client";

import React from "react";

export default function DocEngineTemplates() {
  return (
    <section id="templates" className="pad-t">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow reveal">The template library &middot; 13+</span>
          <h2 className="h2 reveal" style={{ "--d": "80ms" } as React.CSSProperties}>
            Documents your company actually signs.
          </h2>
          <p className="lede reveal" style={{ "--d": "140ms" } as React.CSSProperties}>
            Every template is India-specific and drawn from a versioned clause library that updates as the law changes.
          </p>
        </div>
        <div className="templates reveal">
          <div className="tpl">
            <div className="tn">NDA</div>
            <div className="tg">MUTUAL &middot; ONE-WAY</div>
          </div>
          <div className="tpl">
            <div className="tn">MOU</div>
            <div className="tg">GENERAL</div>
          </div>
          <div className="tpl">
            <div className="tn">Founders&apos; Agreement</div>
            <div className="tg">EQUITY &middot; VESTING</div>
          </div>
          <div className="tpl">
            <div className="tn">Employment Agreement</div>
            <div className="tg">FULL-TIME</div>
          </div>
          <div className="tpl">
            <div className="tn">Consultancy Agreement</div>
            <div className="tg">FREELANCER</div>
          </div>
          <div className="tpl">
            <div className="tn">Vendor &amp; Service</div>
            <div className="tg">B2B</div>
          </div>
          <div className="tpl">
            <div className="tn">Privacy Policy &amp; Terms</div>
            <div className="tg">WEB &middot; APP</div>
          </div>
          <div className="tpl">
            <div className="tn">Non-Compete</div>
            <div className="tg">RESTRICTIVE</div>
          </div>
          <div className="tpl">
            <div className="tn">IP Assignment</div>
            <div className="tg">TRANSFER</div>
          </div>
          <div className="tpl">
            <div className="tn">Shareholders&apos; Agreement</div>
            <div className="tg">INVESTMENT</div>
          </div>
          <div className="tpl">
            <div className="tn">Term Sheet</div>
            <div className="tg">FUNDRAISE</div>
          </div>
          <div className="tpl">
            <div className="tn">Rental / Lease</div>
            <div className="tg">PROPERTY</div>
          </div>
          <div className="tpl">
            <div className="tn">Loan Agreement</div>
            <div className="tg">PROMISSORY</div>
          </div>
        </div>
      </div>
    </section>
  );
}
