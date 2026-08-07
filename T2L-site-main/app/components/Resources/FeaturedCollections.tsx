import React from 'react';

export default function FeaturedCollections() {
  return (
    <>
      <section id="featured" className="pad-s"><div className="wrap">
  <div className="shead reveal"><div className="st"><div className="sicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7-6.6-3.6-6.6 3.6 1.3-7-5-4.8 7-.9z" /></svg></div><div><h2>Featured collections</h2><div className="sdesc">Editor-curated resources, refreshed weekly</div></div></div><a href="#news" className="slink">Browse all<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a></div>
  <div className="feat-grid">
    <a href="#compliance" className="feat reveal" data-item data-title="Founder's Compliance Starter Kit" data-cat="Featured Collection" data-tags="compliance founder checklist roc gst"><div className="fglow"></div><span className="fk">Collection · 12 resources</span><h3>Founder's Compliance Starter Kit</h3><p>Everything a new company needs in year one: ROC calendar, GST basics, board resolutions, and registers.</p><div className="fmeta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7-6.6-3.6-6.6 3.6 1.3-7-5-4.8 7-.9z" /></svg>Most saved this month</div></a>
    <a href="#caselaw" className="feat reveal" style={{ "--d": "80ms" } as React.CSSProperties} data-item data-title="BNS, BNSS & BSA Transition Guide" data-cat="Featured Collection" data-tags="bns bnss bsa criminal law new codes"><div className="fglow"></div><span className="fk">Collection · 9 resources</span><h3>New Criminal Codes: BNS, BNSS &amp; BSA</h3><p>Section-by-section mapping from the IPC, CrPC, and Evidence Act to the three new codes, with landmark reading.</p><div className="fmeta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>Trending in Case Law</div></a>
    <a href="#events" className="feat reveal" style={{ "--d": "160ms" } as React.CSSProperties} data-item data-title="Legal Tech & Startup Law Events 2026" data-cat="Featured Collection" data-tags="events summit conference startup legaltech"><div className="fglow"></div><span className="fk">Collection · 18 events</span><h3>Startup Law &amp; Legal Tech Events 2026</h3><p>Conferences, summits, and meetups worth attending this year, for founders, litigators, and law students alike.</p><div className="fmeta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>Updated 2 days ago</div></a>
  </div>
</div></section>
    </>
  );
}
