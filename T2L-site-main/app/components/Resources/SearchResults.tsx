import React from 'react';
import { resourcesData } from './resourcesData';

interface Props {
  query: string;
  onClear: () => void;
}

export default function SearchResults({ query, onClear }: Props) {
  const q = query.trim().toLowerCase();
  
  let matches = resourcesData.filter(c => {
    const text = `${c.title} ${c.cat} ${c.tags} ${c.innerHtml}`.toLowerCase();
    return text.includes(q);
  });
  
  // Basic dedup logic just in case
  matches = matches.filter((item, index, self) => index === self.findIndex((t) => t.title === item.title));
  
  matches = matches.slice(0, 60); // match original slice logic

  return (
    <>
      <section id="searchResults" className="pad-s on"><div className="wrap">
  <div className="sr-head">
    <div className="srt">Results for &ldquo;<b id="srQuery">{query}</b>&rdquo; <span className="mono" style={{ fontSize: "14px", color: "var(--gray-2)" }} id="srCount">· {matches.length} found</span></div>
    <button className="sr-clear" id="srClear" onClick={onClear}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6 6 18M6 6l12 12" /></svg>Clear search</button>
  </div>
  
  {matches.length > 0 ? (
    <div id="searchResultsGrid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" }}>
      {matches.map((item, idx) => {
        return React.createElement(item.tag || 'div', {
          key: idx,
          ...item.attrs,
          className: (item.attrs.className || '') + ' reveal in', // ensure visible
          dangerouslySetInnerHTML: { __html: item.innerHtml }
        });
      })}
    </div>
  ) : (
    <div className="sr-empty" id="srEmpty"><div className="ei"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /><line x1="8" y1="11" x2="14" y2="11" /></svg></div><div>No resources matched your search. Try a broader term like <b style={{ color: "var(--ink)" }}>bail</b>, <b style={{ color: "var(--ink)" }}>GST</b>, or <b style={{ color: "var(--ink)" }}>event</b>.</div></div>
  )}
</div></section>
    </>
  );
}
