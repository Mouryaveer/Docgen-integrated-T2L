import React, { useState } from 'react';

export default function Learning() {
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
      <section id="learning" className="pad-s"><div className="wrap">
  <div className="shead reveal in"><div className="st"><div className="sicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></svg></div><div><h2>Learning center</h2><div className="sdesc">Articles, explainers, and beginner guides to legal concepts</div></div></div></div>
  <div className="grid g3">
    <article className="card reveal in js-card" data-item data-title="What is an ESOP explained founders" data-cat="Article" data-tags="esop equity explainer learning founder guide"><div className="ctop"><span className="src-pill blue">EXPLAINER</span><span className="cdate">8 min read</span></div><h3>ESOPs, explained for founders</h3><p className="cbody">What an option pool is, how vesting works, and the tax moments that matter, without the jargon.</p><div className="cfoot"><a className="cread" href="/#contact">Read article<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a><button className={`iconbtn bm push ${bookmarks.has('learn-esop') ? 'saved' : ''}`} onClick={() => toggleBookmark('learn-esop')} aria-label="Bookmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg></button></div></article>
    <article className="card reveal in js-card" style={{ "--d": "80ms" } as React.CSSProperties} data-item data-title="Private limited vs LLP which to choose" data-cat="Article" data-tags="private limited llp incorporation guide entity"><div className="ctop"><span className="src-pill blue">GUIDE</span><span className="cdate">6 min read</span></div><h3>Pvt Ltd vs LLP: which to choose</h3><p className="cbody">A side-by-side on liability, compliance, funding, and taxes to pick the right structure on day one.</p><div className="cfoot"><a className="cread" href="/#contact">Read article<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a><button className={`iconbtn bm push ${bookmarks.has('learn-entity') ? 'saved' : ''}`} onClick={() => toggleBookmark('learn-entity')} aria-label="Bookmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg></button></div></article>
    <article className="card reveal in js-card" style={{ "--d": "160ms" } as React.CSSProperties} data-item data-title="Video how to read a term sheet" data-cat="Video" data-tags="term sheet video learning fundraising founder"><div className="ctop"><span className="src-pill red">VIDEO</span><span className="cdate">12 min</span></div><h3>How to read a term sheet</h3><p className="cbody">A walkthrough of the clauses that decide control and economics in your first funding round.</p><div className="cfoot"><a className="cread" href="/#contact">Watch<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg></a><button className={`iconbtn bm push ${bookmarks.has('learn-termsheet') ? 'saved' : ''}`} onClick={() => toggleBookmark('learn-termsheet')} aria-label="Bookmark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg></button></div></article>
  </div>
</div></section>
    </>
  );
}
