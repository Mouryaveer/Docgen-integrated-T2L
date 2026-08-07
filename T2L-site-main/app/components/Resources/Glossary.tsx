"use client";

import React, { useState } from 'react';

const glossaryTerms = [
  { letter: "A", title: "Anticipatory Bail", tags: "bail criminal glossary", desc: "A direction to release a person on bail before arrest, sought when someone fears arrest for a non-bailable offence." },
  { letter: "C", title: "Cap Table", tags: "equity fundraising glossary", desc: "A record of who owns what in a company: shares, options, and convertibles, and each holder's ownership percentage." },
  { letter: "D", title: "Due Diligence", tags: "fundraising investor glossary", desc: "The investigation of a company's legal, financial, and business affairs before an investment or acquisition." },
  { letter: "E", title: "ESOP", tags: "equity employees glossary", desc: "Employee Stock Option Plan: a pool of equity set aside to grant employees the option to buy shares over time." },
  { letter: "F", title: "FEMA", tags: "foreign investment rbi glossary", desc: "The Foreign Exchange Management Act, which governs foreign investment and cross-border transactions in India." },
  { letter: "I", title: "Indemnity", tags: "contract clause glossary", desc: "A contractual promise to compensate the other party for specified losses or liabilities." },
  { letter: "J", title: "Jurisdiction", tags: "litigation court glossary", desc: "The authority of a court to hear and decide a matter, based on subject, territory, or value." },
  { letter: "L", title: "Liquidation Preference", tags: "fundraising term sheet glossary", desc: "A term-sheet clause setting who gets paid first, and how much, when a company is sold or wound up." },
  { letter: "M", title: "Moratorium", tags: "insolvency ibc glossary", desc: "A period during insolvency proceedings when legal actions against the company are paused." },
  { letter: "P", title: "Precedent", tags: "litigation judgment glossary", desc: "A past judgment that guides or binds later decisions on similar facts and questions of law." },
  { letter: "V", title: "Vesting", tags: "equity esop glossary", desc: "The schedule over which a founder or employee earns their equity or options, often over four years." },
  { letter: "W", title: "Writ Petition", tags: "constitutional court glossary", desc: "An application to a High Court or the Supreme Court seeking enforcement of fundamental or legal rights." }
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function Glossary() {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const availableLetters = new Set(glossaryTerms.map(t => t.letter));

  const filteredTerms = activeLetter 
    ? glossaryTerms.filter(t => t.letter === activeLetter)
    : glossaryTerms;

  return (
    <>
      <section id="glossary" className="pad-s">
        <div className="wrap">
          <div className="shead reveal">
            <div className="st">
              <div className="sicon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 7c-2-2-6-2-8-1v13c2-1 6-1 8 1 2-2 6-2 8-1V6c-2-1-6-1-8 1z" />
                  <path d="M12 7v13" />
                </svg>
              </div>
              <div>
                <h2>Legal glossary</h2>
                <div className="sdesc">A to Z of legal terms, in plain English</div>
              </div>
            </div>
          </div>
          <div className="glossary-az reveal" id="glossaryAZ">
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                className={`az ${activeLetter === letter ? 'on' : ''}`}
                disabled={!availableLetters.has(letter)}
                onClick={() => setActiveLetter(activeLetter === letter ? null : letter)}
              >
                {letter}
              </button>
            ))}
          </div>
          <div className="terms" id="termsGrid">
            {filteredTerms.map((term, i) => (
              <div key={i} className="term reveal in js-card" data-item data-letter={term.letter} data-title={term.title} data-cat="Glossary" data-tags={term.tags}>
                <div className="tl">
                  <span className="tinit">{term.letter}</span>
                  <span className="tt">{term.title}</span>
                </div>
                <p>{term.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
