import React from 'react';

export default function ComplianceUpdates() {
  return (
    <>
      <section id="compliance" className="pad-s"><div className="wrap">
  <div className="shead reveal"><div className="st"><div className="sicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 14l2 2 4-4" /></svg></div><div><h2>Compliance updates &amp; deadlines</h2><div className="sdesc">Upcoming statutory deadlines you should not miss</div></div></div><a href="#free" className="slink">Get the calendar<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a></div>
  <div className="grid g4">
    <article className="card reveal js-card" data-item data-title="GSTR-3B monthly return due" data-cat="Compliance Deadline" data-tags="gst gstr-3b return monthly deadline"><div className="ctop"><span className="src-pill red">DUE SOON</span><span className="cdate">20 Jul</span></div><h3>GSTR-3B summary return</h3><p className="cbody">Monthly summary return and tax payment for June 2026 for regular taxpayers.</p><div className="cpub"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>11 days left</div></article>
    <article className="card reveal js-card" style={{ "--d": "60ms" } as React.CSSProperties} data-item data-title="TDS payment for June" data-cat="Compliance Deadline" data-tags="tds income tax payment deadline"><div className="ctop"><span className="src-pill">INCOME TAX</span><span className="cdate">07 Jul</span></div><h3>TDS / TCS deposit</h3><p className="cbody">Deposit of tax deducted or collected at source for the month of June 2026.</p><div className="cpub"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6 9 17l-5-5" /></svg>Recurring monthly</div></article>
    <article className="card reveal js-card" style={{ "--d": "120ms" } as React.CSSProperties} data-item data-title="DPT-3 return of deposits" data-cat="Compliance Deadline" data-tags="dpt-3 mca roc deposits annual"><div className="ctop"><span className="src-pill">MCA</span><span className="cdate">31 Jul</span></div><h3>DPT-3 return of deposits</h3><p className="cbody">Annual return of deposits and outstanding loans for companies for FY 2025-26.</p><div className="cpub"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>22 days left</div></article>
    <article className="card reveal js-card" style={{ "--d": "180ms" } as React.CSSProperties} data-item data-title="ITR filing for individuals" data-cat="Compliance Deadline" data-tags="itr income tax return filing individuals"><div className="ctop"><span className="src-pill blue">INCOME TAX</span><span className="cdate">31 Jul</span></div><h3>ITR filing (non-audit)</h3><p className="cbody">Income tax return due date for individuals and non-audit cases for AY 2026-27.</p><div className="cpub"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>22 days left</div></article>
  </div>
</div></section>
    </>
  );
}
