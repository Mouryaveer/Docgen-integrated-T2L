"use client";

import React, { useState, useRef, useEffect } from "react";

interface FAQCardProps {
  question: string;
  answer: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  delayStyle?: React.CSSProperties;
}

export default function FAQCard({
  question,
  answer,
  icon,
  defaultOpen = false,
  delayStyle = {}
}: FAQCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelRef = useRef<HTMLDivElement>(null);

  // Recalculate panel height dynamically on state changes or screen resizing
  useEffect(() => {
    const updateHeight = () => {
      const panel = panelRef.current;
      if (!panel) return;
      if (isOpen) {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      } else {
        panel.style.maxHeight = "0px";
      }
    };

    // Run layout adjustments next tick to ensure full render is measured
    const timeout = setTimeout(updateHeight, 20);

    window.addEventListener("resize", updateHeight);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateHeight);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`faq-card reveal in ${isOpen ? "open" : ""}`}
      style={delayStyle}
      data-faq
    >
      <button
        className="faq-q2"
        type="button"
        aria-expanded={isOpen}
        onClick={toggleOpen}
      >
        {icon && <span className="faq-ico2">{icon}</span>}
        <span className="faq-qtext">{question}</span>
        <span className="faq-toggle"></span>
      </button>
      <div
        ref={panelRef}
        className="faq-panel2"
        style={{ transition: "max-height 0.5s var(--ease)" }}
      >
        <p className="faq-a2">{answer}</p>
      </div>
    </div>
  );
}
