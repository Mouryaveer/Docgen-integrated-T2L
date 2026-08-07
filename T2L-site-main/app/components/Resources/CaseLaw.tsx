import React, { useState } from 'react';

export default function CaseLaw() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <section id="caselaw" className="pad-s"><div className="wrap">
  <div className="shead reveal in"><div className="st"><div className="sicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3v18M7 7h10M5 21h14" /><path d="M6 7l-3 6a3 3 0 0 0 6 0zM18 7l-3 6a3 3 0 0 0 6 0z" /></svg></div><div><h2>Case law library</h2><div className="sdesc">Judgments with plain-language summaries and key takeaways</div></div></div><a href="https://www.scconline.com/" target="_blank" rel="noopener noreferrer" className="slink">Full database<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 17 17 7M7 7h10v10" /></svg></a></div>
  <div className="grid g2">
    <article className="card reveal in js-card" data-item data-title="Sushila Aggarwal v State NCT Delhi anticipatory bail" data-cat="Judgment" data-tags="anticipatory bail crpc bnss constitution bench supreme court"><div className="ctop"><span className="src-pill">SUPREME COURT</span><span className="cdate">(2020) 5 SCC 1</span></div><h3>Sushila Aggarwal v. State (NCT of Delhi)</h3><p className="cbody"><b style={{ color: "var(--ink)" }}>Holding:</b> Anticipatory bail need not be limited to a fixed period and can continue until the end of trial, subject to conditions.</p><div className="ctags"><span className="ctag">Anticipatory Bail</span><span className="ctag">Constitution Bench</span><span className="ctag">CrPC / BNSS</span></div><div className="cfoot"><a className="cread" href="https://www.scconline.com/" target="_blank" rel="noopener noreferrer">Read summary<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 17 17 7M7 7h10v10" /></svg></a><button className={`iconbtn bm push ${bookmarks.has('case-sushila') ? 'saved' : ''}`} onClick={() => toggleBookmark('case-sushila')} aria-label="Bookmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg></button></div></article>

    <article className="card reveal in js-card" style={{ "--d": "80ms" } as React.CSSProperties} data-item data-title="Arnesh Kumar v State of Bihar arrest guidelines" data-cat="Judgment" data-tags="arrest section 41 crpc bnss guidelines supreme court"><div className="ctop"><span className="src-pill">SUPREME COURT</span><span className="cdate">(2014) 8 SCC 273</span></div><h3>Arnesh Kumar v. State of Bihar</h3><p className="cbody"><b style={{ color: "var(--ink)" }}>Holding:</b> Lays down mandatory checks before arrest in offences punishable up to seven years, curbing automatic arrests.</p><div className="ctags"><span className="ctag">Arrest</span><span className="ctag">Section 41 CrPC</span><span className="ctag">Good Law</span></div><div className="cfoot"><a className="cread" href="https://www.scconline.com/" target="_blank" rel="noopener noreferrer">Read summary<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 17 17 7M7 7h10v10" /></svg></a><button className={`iconbtn bm push ${bookmarks.has('case-arnesh') ? 'saved' : ''}`} onClick={() => toggleBookmark('case-arnesh')} aria-label="Bookmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg></button></div></article>

    {isExpanded && (
      <>
        <article className="card reveal in js-card cl-more" data-item data-title="Kesavananda Bharati basic structure" data-cat="Judgment" data-tags="basic structure constitution amendment landmark supreme court"><div className="ctop"><span className="src-pill">SUPREME COURT</span><span className="cdate">(1973) 4 SCC 225</span></div><h3>Kesavananda Bharati v. State of Kerala</h3><p className="cbody"><b style={{ color: "var(--ink)" }}>Holding:</b> Establishes the basic structure doctrine: Parliament cannot amend the Constitution to destroy its essential features.</p><div className="ctags"><span className="ctag">Basic Structure</span><span className="ctag">Constitutional</span><span className="ctag">Landmark</span></div><div className="cfoot"><a className="cread" href="https://www.scconline.com/" target="_blank" rel="noopener noreferrer">Read summary<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 17 17 7M7 7h10v10" /></svg></a><button className={`iconbtn bm push ${bookmarks.has('case-kesav') ? 'saved' : ''}`} onClick={() => toggleBookmark('case-kesav')} aria-label="Bookmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg></button></div></article>

        <article className="card reveal in js-card cl-more" data-item data-title="Vishaka v State of Rajasthan workplace harassment" data-cat="Judgment" data-tags="posh workplace harassment women guidelines supreme court"><div className="ctop"><span className="src-pill">SUPREME COURT</span><span className="cdate">(1997) 6 SCC 241</span></div><h3>Vishaka v. State of Rajasthan</h3><p className="cbody"><b style={{ color: "var(--ink)" }}>Holding:</b> Framed guidelines against sexual harassment at the workplace, later codified in the POSH Act, 2013.</p><div className="ctags"><span className="ctag">POSH</span><span className="ctag">Workplace</span><span className="ctag">Superseded by Statute</span></div><div className="cfoot"><a className="cread" href="https://www.scconline.com/" target="_blank" rel="noopener noreferrer">Read summary<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 17 17 7M7 7h10v10" /></svg></a><button className={`iconbtn bm push ${bookmarks.has('case-vishaka') ? 'saved' : ''}`} onClick={() => toggleBookmark('case-vishaka')} aria-label="Bookmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg></button></div></article>
      </>
    )}
  </div>
  {!isExpanded && (
    <div className="loadmore"><button className="btn btn-ghost" onClick={() => setIsExpanded(true)}>Load more judgments <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></button></div>
  )}
</div></section>
    </>
  );
}
