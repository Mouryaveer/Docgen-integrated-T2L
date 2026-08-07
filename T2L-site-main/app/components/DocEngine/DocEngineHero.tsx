"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

export default function DocEngineHero() {
  const [promptValue, setPromptValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 172) + "px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (promptValue.trim()) {
        const form = e.currentTarget.closest("form");
        if (form) form.submit();
      }
    }
  };

  const handleChipClick = (text: string) => {
    setPromptValue(text);
    // We need to use setTimeout to allow React to update the DOM value 
    // before we calculate the new scrollHeight
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 172) + "px";
        textareaRef.current.focus();
      }
    }, 0);
  };

  return (
    <section className="phero">
      <div className="hero-bg">
        <div className="hero-mesh"></div>
        <div className="hero-grid-lines"></div>
        <div className="nglow">
          <svg>
            <use href="#nmark"></use>
          </svg>
        </div>
      </div>
      
      <div className="wrap">
        <div className="phero-inner center">
          <span className="crumb reveal">
            <Link href="/">Home</Link> / Doc Engine
          </span>
          <h1 className="reveal" style={{ "--d": "60ms" } as React.CSSProperties}>
            Prompt in.<br />
            <span className="g">Drafted document out.</span>
          </h1>
          <p className="lede reveal" style={{ "--d": "140ms" } as React.CSSProperties}>
            Plain language in. A well-drafted, India-specific document out, in minutes.
          </p>
          
          <div className="de-composer reveal" style={{ "--d": "220ms" } as React.CSSProperties}>
            <form className="dec-form" action="/docengine-app.html" method="get" autoComplete="off">
              <div className="dec-box">
                <svg className="dec-spark" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"></path>
                </svg>
                <textarea
                  name="prompt"
                  id="dePrompt"
                  rows={1}
                  placeholder="e.g. A mutual NDA with a vendor in Bengaluru, 2-year term"
                  required
                  value={promptValue}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  ref={textareaRef}
                ></textarea>
                <button type="submit" className="dec-btn">
                  Draft it{" "}
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </button>
              </div>
              <div className="dec-hint">
                <b>Press Enter</b> to draft &nbsp;&middot;&nbsp; Shift + Enter for a new line
              </div>
              <div className="dec-chips">
                <button
                  type="button"
                  className="dec-chip"
                  onClick={() => handleChipClick("A mutual NDA between my startup and a vendor in Bengaluru, with a 2-year term.")}
                >
                  Mutual NDA
                </button>
                <button
                  type="button"
                  className="dec-chip"
                  onClick={() => handleChipClick("A founders' agreement for two co-founders splitting equity 60/40 with a 4-year vesting schedule and a 1-year cliff.")}
                >
                  Founders&apos; Agreement
                </button>
                <button
                  type="button"
                  className="dec-chip"
                  onClick={() => handleChipClick("A full-time employment agreement for a software engineer in Delhi, with a 3-month probation and standard notice period.")}
                >
                  Employment
                </button>
                <button
                  type="button"
                  className="dec-chip"
                  onClick={() => handleChipClick("A consultancy agreement for a freelance designer engaged for 6 months, paid monthly, with IP assigned to the company.")}
                >
                  Consultancy
                </button>
                <button
                  type="button"
                  className="dec-chip"
                  onClick={() => handleChipClick("A rental agreement for a residential flat in Mumbai for an 11-month term with a refundable security deposit.")}
                >
                  Rental / Lease
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
