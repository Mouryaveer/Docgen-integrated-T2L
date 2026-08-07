"use client";

import React, { useState, useRef, useEffect } from "react";

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current) {
      if (isOpen) {
        itemRef.current.classList.add("open");
      } else {
        itemRef.current.classList.remove("open");
      }
    }

    if (panelRef.current) {
      if (isOpen) {
        panelRef.current.style.maxHeight = `${panelRef.current.scrollHeight}px`;
      } else {
        panelRef.current.style.maxHeight = "";
      }
    }
  }, [isOpen]);

  return (
    <div className="faq-item reveal" ref={itemRef}>
      <button className="faq-q" type="button" onClick={onClick}>
        {question}
        <span className="faq-ico"></span>
      </button>
      <div className="faq-panel" ref={panelRef}>
        <div className="faq-a">{answer}</div>
      </div>
    </div>
  );
}

export default function DocEngineFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is Doc Engine?",
      a: "Doc Engine turns a plain-language prompt into a well-drafted, India-specific legal document in minutes. It flags risky clauses, explains each clause in plain language, and lets you sign online with a full audit trail.",
    },
    {
      q: "Does the AI write the legal language itself?",
      a: "No. Documents are assembled from a versioned, India-specific clause library. The AI never free-writes statutory language, and every clause carries a plain-language explainer so you know what you are signing.",
    },
    {
      q: "What documents can I generate?",
      a: "More than thirteen templates, including NDAs, MOUs, Founders’ Agreements, employment and consultancy contracts, vendor agreements, privacy policies, IP assignments, shareholders’ agreements, term sheets, leases, and loan agreements.",
    },
    {
      q: "Can a lawyer review my document?",
      a: "Yes. At any point you can bring in a Turn2Law lawyer for a fixed-fee review. AI output is decision support and, for high-stakes documents, should be reviewed by qualified counsel before use.",
    },
    {
      q: "How do I sign and export?",
      a: "Sign online with a tamper-evident audit trail. Executed versions lock automatically and export to PDF and DOCX, with full version history kept forever.",
    },
  ];

  return (
    <section id="faq" className="pad-t">
      <div className="wrap">
        <div className="sec-head center">
          <span className="eyebrow center reveal">Frequently asked</span>
          <h2 className="h2 reveal" style={{ "--d": "80ms", margin: "18px 0 18px" } as React.CSSProperties}>
            Questions, answered.
          </h2>
        </div>
        <div className="faq">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
