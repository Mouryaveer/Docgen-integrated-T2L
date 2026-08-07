import React from 'react';

export default function Media() {
  return (
    <>
      <section id="media" className="pad-s"><div className="wrap">
  <div className="shead reveal"><div className="st"><div className="sicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v3" /></svg></div><div><h2>Podcasts &amp; webinars</h2><div className="sdesc">Listen and watch on the move</div></div></div></div>
  <div className="grid g3">
    <article className="card reveal js-card" data-item data-title="The Startup Legal Podcast episode" data-cat="Podcast" data-tags="podcast startup legal audio founder"><div className="ctop"><span className="src-pill">PODCAST</span><span className="cdate">EP 14</span></div><h3>The Startup Legal Podcast</h3><p className="cbody">Founders and lawyers on the legal decisions that shaped their companies.</p><div className="cfoot"><a className="cread" href="/#contact">Listen<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg></a><button className="iconbtn bm push" data-bm="pod-startup" aria-label="Bookmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg></button></div></article>
    <article className="card reveal js-card" style={{ "--d": "80ms" } as React.CSSProperties} data-item data-title="Compliance clinic webinar recording" data-cat="Webinar" data-tags="webinar compliance recording roc gst"><div className="ctop"><span className="src-pill blue">WEBINAR</span><span className="cdate">On demand</span></div><h3>Monthly Compliance Clinic</h3><p className="cbody">A recurring session answering the compliance questions founders actually ask.</p><div className="cfoot"><a className="cread" href="/#contact">Watch replay<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg></a><button className="iconbtn bm push" data-bm="web-clinic" aria-label="Bookmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg></button></div></article>
    <article className="card reveal js-card" style={{ "--d": "160ms" } as React.CSSProperties} data-item data-title="Litigation strategy webinar lawyers" data-cat="Webinar" data-tags="litigation strategy webinar lawyers criminal"><div className="ctop"><span className="src-pill blue">WEBINAR</span><span className="cdate">On demand</span></div><h3>Building a Case: Research to Argument</h3><p className="cbody">How litigators move from precedent research to a courtroom-ready argument.</p><div className="cfoot"><a className="cread" href="/#contact">Watch replay<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg></a><button className="iconbtn bm push" data-bm="web-litigation" aria-label="Bookmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg></button></div></article>
  </div>
</div></section>
    </>
  );
}
