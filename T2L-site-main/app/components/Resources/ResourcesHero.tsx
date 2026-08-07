"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Props {
  onSearch: (q: string) => void;
}

export default function ResourcesHero({ onSearch }: Props) {
  const [val, setVal] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch(val);
  };

  return (
    <section className="phero">
      <div className="nglow">
        <svg>
          <use href="#nmark"></use>
        </svg>
      </div>
      <div className="wrap">
        <div className="phero-inner">
          <span className="crumb reveal in">
            <Link href="/">Home</Link> / Resources
          </span>
          <h1 className="reveal in" style={{ "--d": "60ms" } as React.CSSProperties}>
            Everything legal,<br />
            <span className="g">searchable in one place.</span>
          </h1>
          <p
            className="lede reveal in"
            style={{ "--d": "140ms", marginLeft: "auto", marginRight: "auto" } as React.CSSProperties}
          >
            Judgments, acts, templates, government portals, and legal events, curated for founders, lawyers,
            students, and legal teams. Search it, save it, and stay updated with India's legal ecosystem.
          </p>

          <div className="searchbar reveal in" style={{ "--d": "200ms" } as React.CSSProperties}>
            <form className="searchbar-in" onSubmit={handleSearch}>
              <svg className="sic" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input
                id="globalSearch"
                type="text"
                autoComplete="off"
                aria-label="Search resources"
                placeholder="Search judgments..."
                value={val}
                onChange={(e) => {
                  setVal(e.target.value);
                  onSearch(e.target.value);
                }}
              />
              <span className="aihint">
                <i></i>AI Search
              </span>
              <button type="submit" className="btn btn-gold" id="searchBtn">
                Search
              </button>
            </form>
            <div className="search-meta">
              <b id="idxCount">1,240+</b> resources indexed <span>·</span> Try{" "}
              <b>“anticipatory bail”</b>, <b>“GST deadline”</b>, or <b>“startup law summit”</b>
            </div>
          </div>

          <div className="chips reveal" style={{ "--d": "260ms" } as React.CSSProperties}>
            <a href="#news" className="chip">
              <span className="emo">
                <svg viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="8" y1="13" x2="16" y2="13"></line>
                  <line x1="8" y1="17" x2="13" y2="17"></line>
                </svg>
              </span>
              Legal News
            </a>
            <a href="#caselaw" className="chip">
              <span className="emo">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3v18M7 7h10M5 21h14"></path>
                  <path d="M6 7l-3 6a3 3 0 0 0 6 0zM18 7l-3 6a3 3 0 0 0 6 0z"></path>
                </svg>
              </span>
              Case Law
            </a>
            <a href="#acts" className="chip">
              <span className="emo">
                <svg viewBox="0 0 24 24">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </span>
              Acts & Regulations
            </a>
            <a href="#documents" className="chip">
              <span className="emo">
                <svg viewBox="0 0 24 24">
                  <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="14 3 14 9 20 9"></polyline>
                  <line x1="8" y1="13" x2="15" y2="13"></line>
                  <line x1="8" y1="17" x2="13" y2="17"></line>
                </svg>
              </span>
              Templates
            </a>
            <a href="#portals" className="chip">
              <span className="emo">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M3 12h18M12 3c2.5 2.5 4 6 4 9s-1.5 6.5-4 9c-2.5-2.5-4-6-4-9s1.5-6.5 4-9z"></path>
                </svg>
              </span>
              Government Portals
            </a>
            <a href="#events" className="chip">
              <span className="emo">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                  <path d="M16 2v4M8 2v4M3 10h18"></path>
                </svg>
              </span>
              Legal Events
            </a>
            <a href="#learning" className="chip">
              <span className="emo">
                <svg viewBox="0 0 24 24">
                  <path d="M22 10 12 5 2 10l10 5 10-5z"></path>
                  <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"></path>
                </svg>
              </span>
              Learning
            </a>
            <a href="#glossary" className="chip">
              <span className="emo">
                <svg viewBox="0 0 24 24">
                  <path d="M12 7c-2-2-6-2-8-1v13c2-1 6-1 8 1 2-2 6-2 8-1V6c-2-1-6-1-8 1z"></path>
                  <path d="M12 7v13"></path>
                </svg>
              </span>
              Glossary
            </a>
          </div>

          <div className="hstats reveal" style={{ "--d": "320ms" } as React.CSSProperties}>
            <div className="hstat">
              <div className="v">
                <b>1,240+</b>
              </div>
              <div className="k">Judgments</div>
            </div>
            <div className="hstat">
              <div className="v">
                <b>85+</b>
              </div>
              <div className="k">Templates</div>
            </div>
            <div className="hstat">
              <div className="v">
                <b>40+</b>
              </div>
              <div className="k">Gov Portals</div>
            </div>
            <div className="hstat">
              <div className="v">
                <b>Daily</b>
              </div>
              <div className="k">Updated</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
