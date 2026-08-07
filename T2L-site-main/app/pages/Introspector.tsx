"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQCard from "../components/FAQCard";
import InteractiveCard from "../components/InteractiveCard";

// Helper hook for animating numbers
function useCountUp(target: number, duration: number = 1400, trigger: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Cubic ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(easedProgress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration, trigger]);

  return count;
}

export default function Introspector() {
  // Glow parallax
  const [glowTranslate, setGlowTranslate] = useState(0);
  const [showToTop, setShowToTop] = useState(false);

  // Stats trigger state
  const [statsTriggered, setStatsTriggered] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Hero typing state
  const [typedText, setTypedText] = useState("");
  const [showCaret, setShowCaret] = useState(true);
  const [answerState, setAnswerState] = useState<"hidden" | "loading" | "done">("hidden");
  const heroAnsRef = useRef<HTMLDivElement>(null);

  // Workflow showcase state
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const showcaseRef = useRef<HTMLDivElement>(null);

  const workflowLabels = [
    "research · legal query",
    "search · judgments",
    "discovery · similar cases",
    "citations · treatment check",
    "briefs · draft assembly",
    "matter · case organisation",
    "timeline · chronology"
  ];

  // Typing effect
  useEffect(() => {
    const textToType = "Is anticipatory bail available for a non-bailable offence under the BNSS?";
    let index = 0;
    let timer: NodeJS.Timeout;

    const startTyping = () => {
      timer = setInterval(() => {
        setTypedText(textToType.slice(0, index));
        index++;
        if (index > textToType.length) {
          clearInterval(timer);
          setShowCaret(false);
          // Show loading spinner
          setAnswerState("loading");
          // After 2 seconds, finish loading and reveal the answer
          setTimeout(() => {
            setAnswerState("done");
          }, 2000);
        }
      }, 40);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(startTyping, 500);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (heroAnsRef.current) {
      observer.observe(heroAnsRef.current);
    }

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  // Stats intersection count-up trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsTriggered(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-advancing Workflow showcase
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 7);
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Parallax background scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 900) {
        setGlowTranslate(y * 0.12);
      }
      setShowToTop(y > 800);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reveal observer for sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const elements = document.querySelectorAll(".reveal:not(.in)");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Count values
  const count90 = useCountUp(90, 1400, statsTriggered);
  const count2400 = useCountUp(2400, 1400, statsTriggered);
  const count1 = useCountUp(1, 1400, statsTriggered);
  const count3 = useCountUp(3, 1400, statsTriggered);

  return (
    <div className="introspector-theme">
      {/* Reusable SVG Symbol for N-Glow */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="nmark" viewBox="0 0 96 118">
          <g fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 108 V26 L70 100 V34"></path>
            <path d="M49 44 L70 18 L91 44"></path>
          </g>
        </symbol>
      </svg>

      {/* Navigation */}
      <Navbar 
        ctaText="Request access" 
        ctaLink="#contact" 
        loginText="Sign in" 
        loginLink="#" 
      />

      <main id="top">
        {/* ================= HERO ================= */}
        <section className="hero">
          <div className="hero-bg">
            <div 
              className="nglow" 
              style={{ transform: `translate(-50%, ${glowTranslate}px)` }}
            >
              <svg><use href="#nmark"></use></svg>
            </div>
          </div>
          <div className="wrap">
            <div className="hero-inner">
              <span className="hero-badge reveal">
                <span className="tag">INTROSPECTOR</span>
                <span className="pointer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                  The AI research workspace for legal professionals
                </span>
              </span>

              <h1 className="reveal" style={{ "--d": "70ms" } as React.CSSProperties}>
                The fastest way<br />to research <span className="g">Indian law.</span>
              </h1>

              <p className="hero-sub reveal" style={{ "--d": "150ms" } as React.CSSProperties}>
                Introspector is the AI research workspace built for advocates, law firms, and corporate legal teams. Ask a question, and get a grounded answer with judgment search, precedent discovery, and citation intelligence.
              </p>

              <div className="hero-ctas reveal" style={{ "--d": "220ms" } as React.CSSProperties}>
                <a href="#contact" className="btn btn-gold">
                  Request early access 
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </a>
                <a href="#contact" className="btn btn-ghost">Book a demo</a>
              </div>
              
              <div className="hero-note reveal" style={{ "--d": "280ms" } as React.CSSProperties}>
                <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>
                Grounded in Indian law. A citation on every claim. Now in closed pilot.
              </div>

              {/* Product Window */}
              <div className="window-wrap reveal" style={{ "--d": "200ms" } as React.CSSProperties}>
                <div className="win-float f1">
                  <span className="d"></span>Retrieval-grounded · <b>0 hallucinated citations</b>
                </div>
                <div className="win-float f2">
                  <b>2,400+</b> judgments searched in 1.9s
                </div>
                
                <div className="window">
                  <div className="win-bar">
                    <div className="win-dots"><i></i><i></i><i></i></div>
                    <div className="win-url">
                      <svg viewBox="0 0 24 24">
                        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      app.introspector.turn2law.in / research
                    </div>
                    <div className="win-chipset">
                      <span className="wc">BNS · BNSS · BSA</span>
                      <span className="wc">SCC · AIR</span>
                    </div>
                  </div>
                  
                  <div className="win-body">
                    <aside className="win-rail">
                      <div className="rail-item on">
                        <svg viewBox="0 0 24 24">
                          <circle cx="11" cy="11" r="7"></circle>
                          <path d="M21 21l-4.35-4.35"></path>
                        </svg>
                        Research
                      </div>
                      <div className="rail-item">
                        <svg viewBox="0 0 24 24">
                          <path d="M3 6h18M3 12h18M3 18h12"></path>
                        </svg>
                        Judgments<span className="cnt">2.4k</span>
                      </div>
                      <div className="rail-item">
                        <svg viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="3"></circle>
                          <circle cx="5" cy="6" r="2"></circle>
                          <circle cx="19" cy="7" r="2"></circle>
                          <circle cx="18" cy="18" r="2"></circle>
                          <path d="M9.5 10.5 6.5 7M14 11l3.3-3M14 13.5l3 3.2"></path>
                        </svg>
                        Precedents
                      </div>
                      <div className="rail-item">
                        <svg viewBox="0 0 24 24">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        Briefs
                      </div>
                      <div className="rail-k">Matters</div>
                      <div className="rail-item">
                        <svg viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        State v. Sharma
                      </div>
                      <div className="rail-item">
                        <svg viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        Mehta Bail App.
                      </div>
                    </aside>
                    
                    <div className="win-main" ref={heroAnsRef}>
                      <div className="qbar">
                        <span className="qi">
                          <svg viewBox="0 0 24 24">
                            <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"></path>
                          </svg>
                        </span>
                        <span className="qtext">{typedText}</span>
                        {showCaret && <span className="caret"></span>}
                        <span className="qgo">Enter</span>
                      </div>
                      
                      {answerState !== "hidden" && (
                        <div className={`answer show ${answerState === "done" ? "done" : ""}`}>
                          <div className="ans-head">
                            {answerState === "loading" ? (
                              <span className="spin"></span>
                            ) : (
                              <span className="chk">
                                <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>
                              </span>
                            )}
                            Grounded answer · 4 authorities
                          </div>
                          <div className="ans-body">
                            Anticipatory bail under Section 482 of the BNSS (formerly Section 438 CrPC) is available for a non-bailable offence, but its grant is discretionary and guided by the gravity of the accusation and the applicant&apos;s antecedents<span className="cite">1</span>. For economic offences the Supreme Court has cautioned against a mechanical grant<span className="cite">2</span>, while custodial interrogation being unnecessary weighs in the applicant&apos;s favour<span className="cite">3</span>.
                          </div>
                          <div className="ans-sources">
                            <div className="src">
                              <span className="sn">1</span>
                              <div>
                                <div className="st">Sushila Aggarwal v. State (NCT of Delhi)</div>
                                <div className="sm">(2020) 5 SCC 1 · Supreme Court · Constitution Bench</div>
                              </div>
                            </div>
                            <div className="src">
                              <span className="sn">2</span>
                              <div>
                                <div className="st">P. Chidambaram v. Directorate of Enforcement</div>
                                <div className="sm">(2019) 9 SCC 24 · Supreme Court</div>
                              </div>
                            </div>
                            <div className="src">
                              <span className="sn">3</span>
                              <div>
                                <div className="st">Siddharam S. Mhetre v. State of Maharashtra</div>
                                <div className="sm">(2011) 1 SCC 694 · Supreme Court</div>
                              </div>
                            </div>
                            <div className="src">
                              <span className="sn">4</span>
                              <div>
                                <div className="st">Gurbaksh Singh Sibbia v. State of Punjab</div>
                                <div className="sm">(1980) 2 SCC 565 · Supreme Court</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="win-glow"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="trust reveal" style={{ "--d": "120ms" } as React.CSSProperties}>
                <span className="lbl">Built for the people who argue the case</span>
                <div className="row">
                  <b>Independent Advocates</b>
                  <b>Litigation Chambers</b>
                  <b>Law Firms</b>
                  <b>Corporate Legal Teams</b>
                  <b>In-house Counsel</b>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MARQUEE ================= */}
        <div className="marquee reveal" aria-hidden="true">
          <div className="marquee-track">
            <span className="marquee-item">Judgment search</span>
            <span className="marquee-item">Precedent discovery</span>
            <span className="marquee-item">Citation intelligence</span>
            <span className="marquee-item">AI research briefs</span>
            <span className="marquee-item">Statute mapping</span>
            <span className="marquee-item">Case organisation</span>
            <span className="marquee-item">Research timelines</span>
            
            <span className="marquee-item">Judgment search</span>
            <span className="marquee-item">Precedent discovery</span>
            <span className="marquee-item">Citation intelligence</span>
            <span className="marquee-item">AI research briefs</span>
            <span className="marquee-item">Statute mapping</span>
            <span className="marquee-item">Case organisation</span>
            <span className="marquee-item">Research timelines</span>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <section className="pad-s" ref={statsRef}>
          <div className="wrap">
            <div className="stats reveal">
              <div className="stat">
                <div className="v">
                  <b>{statsTriggered ? count90 : 90}%</b>
                </div>
                <div className="k">less time on first-pass research</div>
              </div>
              <div className="stat">
                <div className="v">
                  <b>{statsTriggered ? count2400.toLocaleString("en-IN") : "2,400"}+</b>
                </div>
                <div className="k">judgments searched per query</div>
              </div>
              <div className="stat">
                <div className="v">
                  <b>{statsTriggered ? count1 : 1}</b> citation
                </div>
                <div className="k">on every claim, or it does not ship</div>
              </div>
              <div className="stat">
                <div className="v">
                  <b>{statsTriggered ? count3 : 3}</b> codes
                </div>
                <div className="k">BNS, BNSS and BSA, mapped both ways</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WORKFLOWS (interactive) ================= */}
        <section id="workflows" className="pad">
          <div className="wrap">
            <div className="sec-head center reveal">
              <span className="eyebrow center reveal">The workspace</span>
              <h2 className="h2 reveal" style={{ "--d": "70ms" } as React.CSSProperties}>
                Seven ways to research,<br />one grounded workspace.
              </h2>
              <p className="lede reveal" style={{ "--d": "140ms" } as React.CSSProperties}>
                Not a chatbot bolted onto search. Introspector is a research environment where every workflow feeds the same case file, and every output is traceable to a source.
              </p>
            </div>

            <div 
              className="showcase reveal" 
              style={{ "--d": "120ms" } as React.CSSProperties}
              ref={showcaseRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="wf-tabs" role="tablist">
                <button 
                  className={`wf-tab ${activeTab === 0 ? "on" : ""}`} 
                  onClick={() => setActiveTab(0)}
                  role="tab"
                >
                  <span className="ti">
                    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.35-4.35"></path></svg>
                  </span>
                  <span>
                    <span className="tt">Legal research</span>
                    <span className="td">Ask in plain language, get a grounded answer</span>
                  </span>
                  <span key={`p-0-${activeTab}`} className="tprog"></span>
                </button>
                <button 
                  className={`wf-tab ${activeTab === 1 ? "on" : ""}`} 
                  onClick={() => setActiveTab(1)}
                  role="tab"
                >
                  <span className="ti">
                    <svg viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="8" y1="13" x2="16" y2="13"></line>
                      <line x1="8" y1="17" x2="14" y2="17"></line>
                    </svg>
                  </span>
                  <span>
                    <span className="tt">Judgment search</span>
                    <span className="td">Full-text search across judgments and courts</span>
                  </span>
                  <span key={`p-1-${activeTab}`} className="tprog"></span>
                </button>
                <button 
                  className={`wf-tab ${activeTab === 2 ? "on" : ""}`} 
                  onClick={() => setActiveTab(2)}
                  role="tab"
                >
                  <span className="ti">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="3"></circle>
                      <circle cx="5" cy="6" r="2"></circle>
                      <circle cx="19" cy="7" r="2"></circle>
                      <circle cx="18" cy="18" r="2"></circle>
                      <path d="M9.5 10.5 6.5 7M14 11l3.3-3M14 13.5l3 3.2"></path>
                    </svg>
                  </span>
                  <span>
                    <span className="tt">Precedent discovery</span>
                    <span className="td">Similar cases ranked by facts, not keywords</span>
                  </span>
                  <span key={`p-2-${activeTab}`} className="tprog"></span>
                </button>
                <button 
                  className={`wf-tab ${activeTab === 3 ? "on" : ""}`} 
                  onClick={() => setActiveTab(3)}
                  role="tab"
                >
                  <span className="ti">
                    <svg viewBox="0 0 24 24">
                      <path d="M9 11l3 3L22 4"></path>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                  </span>
                  <span>
                    <span className="tt">Citation intelligence</span>
                    <span className="td">Validity, treatment, and court-ready format</span>
                  </span>
                  <span key={`p-3-${activeTab}`} className="tprog"></span>
                </button>
                <button 
                  className={`wf-tab ${activeTab === 4 ? "on" : ""}`} 
                  onClick={() => setActiveTab(4)}
                  role="tab"
                >
                  <span className="ti">
                    <svg viewBox="0 0 24 24">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                  </span>
                  <span>
                    <span className="tt">AI research briefs</span>
                    <span className="td">A structured, cited brief in minutes</span>
                  </span>
                  <span key={`p-4-${activeTab}`} className="tprog"></span>
                </button>
                <button 
                  className={`wf-tab ${activeTab === 5 ? "on" : ""}`} 
                  onClick={() => setActiveTab(5)}
                  role="tab"
                >
                  <span className="ti">
                    <svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                  </span>
                  <span>
                    <span className="tt">Case organisation</span>
                    <span className="td">Documents classified, parties and sections linked</span>
                  </span>
                  <span key={`p-5-${activeTab}`} className="tprog"></span>
                </button>
                <button 
                  className={`wf-tab ${activeTab === 6 ? "on" : ""}`} 
                  onClick={() => setActiveTab(6)}
                  role="tab"
                >
                  <span className="ti">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>
                  </span>
                  <span>
                    <span className="tt">Research timelines</span>
                    <span className="td">A chronology assembled from the record</span>
                  </span>
                  <span key={`p-6-${activeTab}`} className="tprog"></span>
                </button>
              </div>

              <div className="wf-stage">
                <div className="wf-stage-bar">
                  <div className="win-dots"><i></i><i></i><i></i></div>
                  <span className="lbl" id="stageLbl">{workflowLabels[activeTab]}</span>
                  <span className="live">Live</span>
                </div>
                <div className="wf-panels">
                  {/* P1 Legal research */}
                  {activeTab === 0 && (
                    <div className="panel on">
                      <div className="m-q">
                        <span className="ic">
                          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.35-4.35"></path></svg>
                        </span>
                        Can a dying declaration alone sustain a conviction under the BNS?
                      </div>
                      <div className="m-label">Grounded answer</div>
                      <div className="m-prose">
                        A dying declaration recorded under Section 26 of the BSA can be the sole basis for conviction, provided the court is satisfied it is voluntary, truthful, and made in a fit mental state<span className="cite">1</span>. No corroboration is required as a rule of law, only as a rule of prudence<span className="cite">2</span>. Where the declaration is suspicious or incomplete, corroboration becomes essential<span className="cite">3</span>.
                      </div>
                      <div className="m-label">Authorities cited</div>
                      <div className="m-row">
                        <span className="m-ico">
                          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        </span>
                        <div>
                          <div className="m-t">Laxman v. State of Maharashtra</div>
                          <div className="m-s">(2002) 6 SCC 710 · Supreme Court · Constitution Bench</div>
                        </div>
                        <span className="m-tag g">Binding</span>
                      </div>
                      <div className="m-row">
                        <span className="m-ico">
                          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        </span>
                        <div>
                          <div className="m-t">Khushal Rao v. State of Bombay</div>
                          <div className="m-s">AIR 1958 SC 22 · Supreme Court</div>
                        </div>
                        <span className="m-tag g">Followed</span>
                      </div>
                      <div className="m-row">
                        <span className="m-ico">
                          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        </span>
                        <div>
                          <div className="m-t">Paniben v. State of Gujarat</div>
                          <div className="m-s">(1992) 2 SCC 474 · Supreme Court</div>
                        </div>
                        <span className="m-tag">Persuasive</span>
                      </div>
                    </div>
                  )}

                  {/* P2 Judgment search */}
                  {activeTab === 1 && (
                    <div className="panel on">
                      <div className="m-q">
                        <span className="ic">
                          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.35-4.35"></path></svg>
                        </span>
                        cheque bounce · Section 138 NI Act · limitation for complaint
                      </div>
                      <div className="m-filters">
                        <span className="f on">
                          <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>Supreme Court
                        </span>
                        <span className="f">High Courts</span>
                        <span className="f">2015 - 2024</span>
                        <span className="f">3-judge bench</span>
                      </div>
                      <div className="m-label">1,180 judgments · ranked by relevance</div>
                      <div className="m-row">
                        <span className="m-ico">
                          <svg viewBox="0 0 24 24"><path d="M12 3l9 4-9 4-9-4 9-4zM3 12l9 4 9-4M3 17l9 4 9-4"></path></svg>
                        </span>
                        <div>
                          <div className="m-t">Yogesh Jain v. Sumesh Chadha</div>
                          <div className="m-s">Limitation runs from expiry of 15-day notice period · held maintainable</div>
                        </div>
                        <span className="m-tag">98% match</span>
                      </div>
                      <div className="m-row">
                        <span className="m-ico">
                          <svg viewBox="0 0 24 24"><path d="M12 3l9 4-9 4-9-4 9-4zM3 12l9 4 9-4M3 17l9 4 9-4"></path></svg>
                        </span>
                        <div>
                          <div className="m-t">MSR Leathers v. S. Palaniappan</div>
                          <div className="m-s">Successive presentation of cheque permissible before prosecution</div>
                        </div>
                        <span className="m-tag">94% match</span>
                      </div>
                      <div className="m-row">
                        <span className="m-ico">
                          <svg viewBox="0 0 24 24"><path d="M12 3l9 4-9 4-9-4 9-4zM3 12l9 4 9-4M3 17l9 4 9-4"></path></svg>
                        </span>
                        <div>
                          <div className="m-t">Dashrath Rupsingh Rathod v. State of Maharashtra</div>
                          <div className="m-s">Territorial jurisdiction fixed at drawee bank branch</div>
                        </div>
                        <span className="m-tag n">Overruled ⚠</span>
                      </div>
                      <div className="m-chips">
                        <span className="m-chip"><i></i>full-text search</span>
                        <span className="m-chip"><i></i>headnote extraction</span>
                        <span className="m-chip"><i></i>bench strength filter</span>
                      </div>
                    </div>
                  )}

                  {/* P3 Precedent discovery */}
                  {activeTab === 2 && (
                    <div className="panel on">
                      <div className="m-q">
                        <span className="ic">
                          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        </span>
                        Find cases with facts similar to <b style={{ color: "var(--gold-lite)", fontWeight: 600 }}>&nbsp;State v. Sharma</b>
                      </div>
                      <div className="m-label">Ranked by factual similarity, not keywords</div>
                      <div className="m-row">
                        <span className="m-ico">
                          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><circle cx="5" cy="6" r="2"></circle><circle cx="19" cy="7" r="2"></circle><path d="M9.5 10.5 6.5 7M14 11l3.3-3"></path></svg>
                        </span>
                        <div style={{ flex: 1 }}>
                          <div className="m-t">Rajesh Kumar v. State of U.P.</div>
                          <div className="m-meter" style={{ marginTop: "8px" }}>
                            <div className="m-bar" style={{ flex: 1 }}><span style={{ width: "92%" }}></span></div>
                            <span className="pct">92%</span>
                          </div>
                        </div>
                      </div>
                      <div className="m-row">
                        <span className="m-ico">
                          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><circle cx="5" cy="6" r="2"></circle><circle cx="19" cy="7" r="2"></circle><path d="M9.5 10.5 6.5 7M14 11l3.3-3"></path></svg>
                        </span>
                        <div style={{ flex: 1 }}>
                          <div className="m-t">State of Rajasthan v. Manoj</div>
                          <div className="m-meter" style={{ marginTop: "8px" }}>
                            <div className="m-bar" style={{ flex: 1 }}><span style={{ width: "87%" }}></span></div>
                            <span className="pct">87%</span>
                          </div>
                        </div>
                      </div>
                      <div className="m-row">
                        <span className="m-ico">
                          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><circle cx="5" cy="6" r="2"></circle><circle cx="19" cy="7" r="2"></circle><path d="M9.5 10.5 6.5 7M14 11l3.3-3"></path></svg>
                        </span>
                        <div style={{ flex: 1 }}>
                          <div className="m-t">Vinod v. State (Delhi)</div>
                          <div className="m-meter" style={{ marginTop: "8px" }}>
                            <div className="m-bar" style={{ flex: 1 }}><span style={{ width: "81%" }}></span></div>
                            <span className="pct">81%</span>
                          </div>
                        </div>
                      </div>
                      <div className="m-label">Matched facts</div>
                      <div className="m-chips">
                        <span className="m-chip"><i></i>circumstantial evidence</span>
                        <span className="m-chip"><i></i>last-seen theory</span>
                        <span className="m-chip"><i></i>recovery under BSA s.23</span>
                        <span className="m-chip"><i></i>chain of custody challenged</span>
                      </div>
                    </div>
                  )}

                  {/* P4 Citation intelligence */}
                  {activeTab === 3 && (
                    <div className="panel on">
                      <div className="m-q">
                        <span className="ic">
                          <svg viewBox="0 0 24 24">
                            <path d="M9 11l3 3L22 4"></path>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                          </svg>
                        </span>
                        Verify: Arnesh Kumar v. State of Bihar, (2014) 8 SCC 273
                      </div>
                      <div className="m-label">Citation health</div>
                      <div className="m-grid2">
                        <div className="m-mini">
                          <div className="mk">Status</div>
                          <div style={{ marginTop: "10px" }}><span className="treat good"><i></i>Good law · still binding</span></div>
                        </div>
                        <div className="m-mini">
                          <div className="mk">Cited by</div>
                          <div className="mv">1,240 <small>later judgments</small></div>
                        </div>
                      </div>
                      <div className="m-label">Subsequent treatment</div>
                      <div className="m-row">
                        <div style={{ flex: 1 }}>
                          <div className="m-t">Followed</div>
                          <div className="m-s">Guidelines on arrest under s.35 BNSS reaffirmed</div>
                        </div>
                        <span className="treat good"><i></i>862</span>
                      </div>
                      <div className="m-row">
                        <div style={{ flex: 1 }}>
                          <div className="m-t">Distinguished</div>
                          <div className="m-s">On offences carrying over 7 years imprisonment</div>
                        </div>
                        <span className="treat warn"><i></i>118</span>
                      </div>
                      <div className="m-row">
                        <div style={{ flex: 1 }}>
                          <div className="m-t">Overruled in part</div>
                          <div className="m-s">None on the core holding</div>
                        </div>
                        <span className="treat bad"><i></i>0</span>
                      </div>
                      <div className="m-label">Court-ready citation</div>
                      <div className="m-q" style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: "12.5px", color: "var(--gold-lite)" }}>
                        <span className="ic" style={{ background: "rgba(255, 255, 255, .06)" }}>
                          <svg viewBox="0 0 24 24" style={{ stroke: "var(--gold)" }}>
                            <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </span>
                        Arnesh Kumar v. State of Bihar, (2014) 8 SCC 273
                      </div>
                    </div>
                  )}

                  {/* P5 AI research briefs */}
                  {activeTab === 4 && (
                    <div className="panel on">
                      <div className="m-q">
                        <span className="ic">
                          <svg viewBox="0 0 24 24">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                          </svg>
                        </span>
                        Draft a research brief on anticipatory bail for economic offences
                      </div>
                      <div className="m-label">Assembling brief · 4 sections</div>
                      <div className="brief">
                        <div className="brief-h text-left">
                          <span className="m-ico" style={{ width: "28px", height: "28px", borderRadius: "8px" }}>
                            <svg viewBox="0 0 24 24" style={{ width: "14px", height: "14px" }}>
                              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                          </span>
                          <span className="bt ml-2">Research Brief · Anticipatory Bail</span>
                          <span className="bm">DRAFT v1 · 6 authorities</span>
                        </div>
                        <div className="brief-b">
                          <div className="brief-sec"><div className="bh">Issue</div><div className="bl w9"></div><div className="bl w7"></div></div>
                          <div className="brief-sec"><div className="bh">Statutory framework · BNSS s.482</div><div className="bl w8"></div><div className="bl w9 gold"></div><div className="bl w5"></div></div>
                          <div className="brief-sec"><div className="bh">Authorities and analysis</div><div className="bl w9"></div><div className="bl w8"></div><div className="bl w7"></div></div>
                          <div className="brief-sec"><div className="bh">Conclusion</div><div className="bl w7"></div></div>
                        </div>
                        <div className="brief-foot">
                          <span className="ex"><svg viewBox="0 0 24 24"><path d="M12 15V3m0 12l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path></svg>PDF</span>
                          <span className="ex"><svg viewBox="0 0 24 24"><path d="M12 15V3m0 12l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path></svg>DOCX</span>
                          <span className="ex">
                            <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            Copy with citations
                          </span>
                          <span className="m-tag g" style={{ marginLeft: "auto" }}>Every claim sourced</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* P6 Case organisation */}
                  {activeTab === 5 && (
                    <div className="panel on">
                      <div className="m-q">
                        <span className="ic">
                          <svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        </span>
                        Matter · State v. Sharma · 38 documents uploaded
                      </div>
                      <div className="m-label">Auto-classified from the record</div>
                      <div className="m-row">
                        <span className="m-ico">
                          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        </span>
                        <div>
                          <div className="m-t">FIR &amp; Chargesheet</div>
                          <div className="m-s">OCR complete · Hindi + English · sections extracted</div>
                        </div>
                        <span className="m-tag g">9 docs</span>
                      </div>
                      <div className="m-row">
                        <span className="m-ico">
                          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                        </span>
                        <div>
                          <div className="m-t">Witness statements</div>
                          <div className="m-s">7 witnesses · linked to parties and events</div>
                        </div>
                        <span className="m-tag g">12 docs</span>
                      </div>
                      <div className="m-row">
                        <span className="m-ico">
                          <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>
                        </span>
                        <div>
                          <div className="m-t">Court orders</div>
                          <div className="m-s">Bail, framing of charge, adjournments</div>
                        </div>
                        <span className="m-tag g">11 docs</span>
                      </div>
                      <div className="m-label">Sections invoked · mapped to new codes</div>
                      <div className="m-chips">
                        <span className="m-chip"><i></i>IPC 302 → BNS 103</span>
                        <span className="m-chip"><i></i>IPC 201 → BNS 238</span>
                        <span className="m-chip"><i></i>CrPC 161 → BNSS 180</span>
                        <span className="m-chip"><i></i>Evidence 27 → BSA 23</span>
                      </div>
                    </div>
                  )}

                  {/* P7 Research timelines */}
                  {activeTab === 6 && (
                    <div className="panel on">
                      <div className="m-q">
                        <span className="ic">
                          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>
                        </span>
                        Build a chronology for State v. Sharma from the record
                      </div>
                      <div className="m-label">Assembled from dated documents</div>
                      <div className="tl text-left">
                        <div className="tl-node done">
                          <div className="tl-date">14 Mar 2024</div>
                          <div className="tl-t">FIR registered · P.S. Model Town</div>
                          <div className="tl-s">Sourced from FIR copy, page 1</div>
                        </div>
                        <div className="tl-node done">
                          <div className="tl-date">02 Apr 2024</div>
                          <div className="tl-t">Arrest and remand</div>
                          <div className="tl-s">Sourced from remand order</div>
                        </div>
                        <div className="tl-node done">
                          <div className="tl-date">28 May 2024</div>
                          <div className="tl-t">Chargesheet filed under BNS 103</div>
                          <div className="tl-s">Sourced from chargesheet, para 7</div>
                        </div>
                        <div className="tl-node">
                          <div className="tl-date">19 Sep 2024</div>
                          <div className="tl-t">Charges framed</div>
                          <div className="tl-s">Next: prosecution evidence</div>
                        </div>
                        <div className="tl-node">
                          <div className="tl-date">11 Feb 2025</div>
                          <div className="tl-t">Next hearing · cross-examination</div>
                          <div className="tl-s">Reminder set · email + WhatsApp</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BENTO features ================= */}
        <section className="pad-t">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Why it feels different</span>
              <h2 className="h2" style={{ margin: "18px 0 18px" }}>Speed you can trust,<br />because you can check it.</h2>
              <p className="lede">
                Introspector is fast because it is grounded, not despite it. Retrieval-first architecture means every answer points back to a real source, so you move quickly without losing the paper trail.
              </p>
            </div>
            
            <div className="bento reveal" style={{ "--d": "100ms" } as React.CSSProperties}>
              <div className="bcell feat">
                <div>
                  <span className="eyebrow">Retrieval-grounded</span>
                  <div className="big" style={{ marginTop: "16px" }}><b>0</b> uncited<br />claims</div>
                  <p className="bd" style={{ marginTop: "14px", maxWidth: "340px" }}>
                    Every statement of law is tied to a judgment or a section of the code. If a claim cannot be sourced, it does not reach your screen. No invented citations, ever.
                  </p>
                </div>
                <div className="kv">
                  <span className="p">SCC · AIR · SCR</span>
                  <span className="p">Bare acts</span>
                  <span className="p">High Court reporters</span>
                </div>
              </div>
              
              <div className="bcell c3">
                <div className="bic">
                  <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h12"></path></svg>
                </div>
                <div className="bt">Both codes, both ways</div>
                <p className="bd">
                  Old and new mapped in either direction: IPC to BNS, CrPC to BNSS, Evidence Act to BSA, with the reasoning attached to every mapping.
                </p>
              </div>
              
              <div className="bcell c3">
                <div className="bic">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"></path>
                  </svg>
                </div>
                <div className="bt">Understands legal facts</div>
                <p className="bd">
                  Precedent discovery ranks cases by factual similarity, not keyword overlap, so the closest matches surface even when the words differ.
                </p>
              </div>
              
              <div className="bcell c2">
                <div className="bic">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                </div>
                <div className="bt">Citations, court-ready</div>
                <p className="bd">
                  Validity, treatment, and formatting, ready to paste into a filing.
                </p>
              </div>
              
              <div className="bcell c2">
                <div className="bic">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d="M12 7v5l3 2"></path>
                  </svg>
                </div>
                <div className="bt">One shared case file</div>
                <p className="bd">
                  Research, precedents, and timelines all feed the same matter, not scattered tabs.
                </p>
              </div>
              
              <div className="bcell c2">
                <div className="bic">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div className="bt">Private by architecture</div>
                <p className="bd">
                  Encrypted, India-resident, never used to train models.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= DEEP SPLIT 1: citation intelligence ================= */}
        <section className="pad">
          <div className="wrap">
            <div className="split">
              <div className="split-copy">
                <span className="kicker reveal">Citation intelligence</span>
                <h2 className="h2 reveal" style={{ "--d": "70ms", margin: "16px 0 18px" } as React.CSSProperties}>
                  Know if the case<br />still holds.
                </h2>
                <p className="lede reveal" style={{ "--d": "140ms" } as React.CSSProperties}>
                  A citation is only useful if it is good law. Introspector checks whether an authority has been followed, distinguished, or overruled, and formats it for the court you are filing in.
                </p>
                <ul className="deep-list">
                  <li className="reveal">
                    <span className="n">01</span>
                    <div>
                      <b>Treatment analysis</b>
                      <p>See how later benches have treated a judgment, followed, distinguished, or overruled, at a glance.</p>
                    </div>
                  </li>
                  <li className="reveal" style={{ "--d": "80ms" } as React.CSSProperties}>
                    <span className="n">02</span>
                    <div>
                      <b>Good-law signal</b>
                      <p>A clear status flag on every authority before it goes into your brief.</p>
                    </div>
                  </li>
                  <li className="reveal" style={{ "--d": "160ms" } as React.CSSProperties}>
                    <span className="n">03</span>
                    <div>
                      <b>Court-ready formatting</b>
                      <p>Neutral and reporter citations formatted correctly, ready to paste into a filing.</p>
                    </div>
                  </li>
                </ul>
                <a href="#contact" className="btn btn-gold reveal" style={{ "--d": "200ms" } as React.CSSProperties}>
                  Book a demo 
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </a>
              </div>
              
              <div className="reveal" style={{ "--d": "120ms" } as React.CSSProperties}>
                <div className="mockcard">
                  <div className="mh">
                    <span className="mi">
                      <svg viewBox="0 0 24 24">
                        <path d="M9 11l3 3L22 4"></path>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                    </span>
                    <span className="mt">Citation check</span>
                    <span className="ms">verified · 0.8s</span>
                  </div>
                  <div className="mb">
                    <div className="m-t" style={{ fontSize: "15px" }}>Vishaka v. State of Rajasthan</div>
                    <div className="m-s" style={{ marginBottom: "14px" }}>(1997) 6 SCC 241 · Supreme Court</div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                      <span className="treat warn"><i></i>Legislatively superseded</span>
                      <span className="treat good"><i></i>Principles still cited</span>
                    </div>
                    <div className="m-label mob-hide" style={{ marginTop: 0 }}>Why</div>
                    <div className="m-prose mob-hide" style={{ fontSize: "13px" }}>
                      Guidelines governed workplace harassment until the POSH Act, 2013 codified them. The judgment remains persuasive on constitutional principle but the operative framework is now statutory<span className="cite">§</span>.
                    </div>
                    <div className="m-grid2" style={{ marginTop: "16px" }}>
                      <div className="m-mini"><div className="mk">Cited by</div><div className="mv">3,110</div></div>
                      <div className="m-mini"><div className="mk">Last cited</div><div className="mv" style={{ fontSize: "18px" }}>2024</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= DEEP SPLIT 2: research briefs ================= */}
        <section className="pad-s">
          <div className="wrap">
            <div className="split rev">
              <div className="reveal" style={{ "--d": "120ms" } as React.CSSProperties}>
                <div className="mockcard">
                  <div className="mh">
                    <span className="mi">
                      <svg viewBox="0 0 24 24"><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    </span>
                    <span className="mt">Research brief</span>
                    <span className="ms">generated · cited</span>
                  </div>
                  <div className="mb">
                    <div className="m-prose" style={{ marginBottom: "14px" }}>
                      <b style={{ color: "var(--ink)", fontFamily: "var(--font-poppins), sans-serif" }}>Issue.</b> Whether default bail under Section 187(3) BNSS accrues on the prosecution&apos;s failure to file the chargesheet within the statutory period.
                    </div>
                    <div className="m-label" style={{ marginTop: 0 }}>Rule</div>
                    <div className="m-prose" style={{ fontSize: "13px" }}>
                      The right to default bail is indefeasible once the period expires and the accused applies before the chargesheet is filed<span className="cite">1</span>. It is a facet of Article 21<span className="cite">2</span>.
                    </div>
                    <div className="m-label">Authorities</div>
                    <div className="m-chips">
                      <span className="m-chip"><i></i>Bikramjit Singh v. State of Punjab</span>
                      <span className="m-chip"><i></i>Rakesh Kumar Paul v. State of Assam</span>
                    </div>
                    <div style={{ marginTop: "16px", display: "flex", gap: "9px" }}>
                      <span className="brief-foot" style={{ border: 0, padding: 0 }}>
                        <span className="ex">
                          <svg viewBox="0 0 24 24"><path d="M12 15V3m0 12l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path></svg>Export
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="split-copy">
                <span className="kicker reveal">AI research briefs</span>
                <h2 className="h2 reveal" style={{ "--d": "70ms", margin: "16px 0 18px" } as React.CSSProperties}>
                  From question<br />to brief, in minutes.
                </h2>
                <p className="lede reveal" style={{ "--d": "140ms" } as React.CSSProperties}>
                  Ask a research question and get back a structured brief: issue, rule, authorities, and analysis, with a citation behind every proposition. Edit it, then export to PDF or DOCX.
                </p>
                <ul className="deep-list">
                  <li className="reveal">
                    <span className="n">01</span>
                    <div>
                      <b>Structured, not a wall of text</b>
                      <p>Issue, rule, authorities, analysis, and conclusion, organised the way you would write it.</p>
                    </div>
                  </li>
                  <li className="reveal" style={{ "--d": "80ms" } as React.CSSProperties}>
                    <span className="n">02</span>
                    <div>
                      <b>Sourced by construction</b>
                      <p>Every proposition links to the authority it rests on. Nothing is asserted without a source.</p>
                    </div>
                  </li>
                  <li className="reveal" style={{ "--d": "160ms" } as React.CSSProperties}>
                    <span className="n">03</span>
                    <div>
                      <b>Yours to finish</b>
                      <p>A first draft to sharpen, not a final word. Export and refine in your own workflow.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================= responsible use ================= */}
        <section className="pad-s">
          <div className="wrap">
            <div className="ru reveal">
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
              <div>
                <b>Research supports your judgment. It does not replace it.</b>
                <p>
                  Introspector is decision support for qualified professionals. Section recommendations, precedents, and outcome patterns must be reviewed by qualified counsel before use in any filing or before any court. Turn2Law is a technology platform, not a law firm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= security ================= */}
        <section id="security" className="pad">
          <div className="wrap">
            <div className="sec-head center reveal">
              <span className="eyebrow center">Trust &amp; security</span>
              <h2 className="h2" style={{ margin: "18px 0 18px" }}>Privilege, by architecture.</h2>
              <p className="lede">
                Confidentiality is a design requirement here, not a policy footnote. Case data is isolated, encrypted, and yours alone.
              </p>
            </div>
            
            <div className="sec-grid reveal" style={{ "--d": "100ms" } as React.CSSProperties}>
              <div className="sc">
                <div className="sci">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h4>Encrypted vault</h4>
                <p>Per-matter isolated storage, encrypted at rest and in transit, with access controls you set.</p>
              </div>
              <div className="sc">
                <div className="sci">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5z"></path>
                  </svg>
                </div>
                <h4>India-resident data</h4>
                <p>Your documents and case data are stored in India, under Indian jurisdiction.</p>
              </div>
              <div className="sc">
                <div className="sci">
                  <svg viewBox="0 0 24 24">
                    <path d="M18 20V10M12 20V4M6 20v-6"></path>
                  </svg>
                </div>
                <h4>Never used for training</h4>
                <p>Your matters never train shared models. Privileged material stays privileged.</p>
              </div>
              <div className="sc">
                <div className="sci">
                  <svg viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <path d="M9 15l2 2 4-4"></path>
                  </svg>
                </div>
                <h4>Full audit trail</h4>
                <p>Every access is logged and visible to you, so you always know who saw what, and when.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= how it works ================= */}
        <section className="pad-t">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">How it works</span>
              <h2 className="h2" style={{ margin: "18px 0 0" }}>Three steps to a<br />grounded answer.</h2>
            </div>
            
            <div className="steps reveal" style={{ "--d": "100ms" } as React.CSSProperties}>
              <div className="pstep">
                <div className="pn">STEP 01</div>
                <div className="pic">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"></path>
                  </svg>
                </div>
                <h3>Ask</h3>
                <p>Type a research question in plain language, or open a matter and point Introspector at your own documents.</p>
              </div>
              <div className="pstep">
                <div className="pn">STEP 02</div>
                <div className="pic">
                  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.35-4.35"></path></svg>
                </div>
                <h3>Ground</h3>
                <p>Judgment search, precedent discovery, and statute mapping run against real sources. Every claim carries a citation you can open.</p>
              </div>
              <div className="pstep">
                <div className="pn">STEP 03</div>
                <div className="pic">
                  <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>
                </div>
                <h3>Review</h3>
                <p>Read the answer, check the sources, and assemble a brief or timeline. You stay in control of what goes into the file.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= audiences ================= */}
        <section className="pad">
          <div className="wrap">
            <div className="sec-head center reveal">
              <span className="eyebrow center">Who it is for</span>
              <h2 className="h2" style={{ margin: "18px 0 18px" }}>One workspace,<br />every legal desk.</h2>
              <p className="lede mob-hide">From a solo advocate preparing for the next hearing to an in-house team clearing a research backlog.</p>
            </div>
            
            <div className="forks reveal" style={{ "--d": "100ms" } as React.CSSProperties}>
              <InteractiveCard className="fork">
                <div className="orb"></div>
                <div className="fork-badge">
                  <i>
                    <svg viewBox="0 0 24 24"><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                  </i>
                  Advocates &amp; chambers
                </div>
                <h3>The bench you never had.</h3>
                <p>Carry the research and preparation that normally needs a bench of paralegals, so your hours go into arguing the case.</p>
                <ul>
                  <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>Precedent search across judgments</li>
                  <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>Case files that organise themselves</li>
                  <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>Hearing timelines with reminders</li>
                </ul>
              </InteractiveCard>
              
              <InteractiveCard className="fork">
                <div className="orb"></div>
                <div className="fork-badge">
                  <i>
                    <svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"></path></svg>
                  </i>
                  Law firms
                </div>
                <h3>Research at firm scale.</h3>
                <p>Give associates a grounded starting point and give partners confidence that every citation checks out before it leaves the door.</p>
                <ul>
                  <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>Consistent, cited first drafts</li>
                  <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>Citation validity before filing</li>
                  <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>Shared matters across the team</li>
                </ul>
              </InteractiveCard>
              
              <InteractiveCard className="fork">
                <div className="orb"></div>
                <div className="fork-badge">
                  <i>
                    <svg viewBox="0 0 24 24"><path d="M3 21h18M6 21V4h12v17M9 9h6M9 13h6"></path></svg>
                  </i>
                  Corporate &amp; in-house
                </div>
                <h3>Answers, in-house.</h3>
                <p>Resolve legal questions in minutes without a call to outside counsel, and keep a sourced record of how you got there.</p>
                <ul>
                  <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>Fast, grounded legal research</li>
                  <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>Sourced briefs to share internally</li>
                  <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg>A private, auditable workspace</li>
                </ul>
              </InteractiveCard>
            </div>
          </div>
        </section>

        {/* ================= testimonials ================= */}
        <section className="pad-t">
          <div className="wrap">
            <div className="sec-head center reveal">
              <span className="eyebrow center">From the pilot</span>
              <h2 className="h2" style={{ margin: "18px 0 18px" }}>What early users say.</h2>
            </div>
            
            <div className="tstat reveal" style={{ "--d": "100ms" } as React.CSSProperties}>
              <InteractiveCard className="tcell">
                <div className="qm">&ldquo;</div>
                <div className="q">
                  The precedent search finds cases I would have missed on keywords alone. And every result comes with the citation, so I am not double-checking the tool.
                </div>
                <div className="who">
                  <div className="av">RS</div>
                  <div>
                    <div className="nm">R. Srinivasan</div>
                    <div className="rl">Advocate · Madras High Court</div>
                  </div>
                </div>
              </InteractiveCard>
              
              <InteractiveCard className="tcell">
                <div className="qm">&ldquo;</div>
                <div className="q">
                  First-pass research that used to take a junior two days is a morning now. The brief is a real starting point, not a summary I have to rewrite.
                </div>
                <div className="who">
                  <div className="av">AK</div>
                  <div>
                    <div className="nm">A. Kaur</div>
                    <div className="rl">Partner · Litigation firm, Delhi</div>
                  </div>
                </div>
              </InteractiveCard>
              
              <InteractiveCard className="tcell">
                <div className="qm">&ldquo;</div>
                <div className="q">
                  The citation treatment view is the part I did not know I needed. Knowing a case has been distinguished before I rely on it has saved real embarrassment.
                </div>
                <div className="who">
                  <div className="av">MV</div>
                  <div>
                    <div className="nm">M. Verma</div>
                    <div className="rl">Senior Legal Counsel · In-house</div>
                  </div>
                </div>
              </InteractiveCard>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section id="faq" className="faq-section pad">
          <div className="wrap">
            <div className="sec-head center reveal">
              <span className="eyebrow center">Frequently asked</span>
              <h2 className="h2" style={{ margin: "18px 0 18px" }}>Questions, answered.</h2>
            </div>
            
            <div className="faq">
              <FAQCard 
                question="What is Introspector?"
                answer="Introspector is an AI legal research workspace for legal professionals. It brings judgment search, precedent discovery, citation intelligence, AI research briefs, case organisation, and research timelines into one workspace, all grounded in Indian law with a citation on every claim. It is Pillar 03 of the Turn2Law platform."
                defaultOpen={true}
              />
              <FAQCard 
                question="How is it different from a general AI chatbot?"
                answer="Introspector is retrieval-grounded. Answers are built from real judgments and the current codes, and every claim links to the source it rests on. If a proposition cannot be sourced, it does not reach your screen. There are no invented citations."
              />
              <FAQCard 
                question="Does it draft contracts or handle compliance?"
                answer="No. Introspector is focused on legal research and case preparation. Document drafting, contract generation, and compliance workflows live in DocEngine, a separate product in the Turn2Law platform. Introspector helps you research and build the argument; it does not draft the paperwork."
              />
              <FAQCard 
                question="Which laws and courts does it cover?"
                answer="Applicable-section recommendations are cross-mapped both ways across IPC and BNS, CrPC and BNSS, and the Evidence Act and BSA, with reasoning attached to every mapping. Judgment search spans Supreme Court and High Court decisions, filterable by court, year, and bench strength."
              />
              <FAQCard 
                question="Does it replace a lawyer's judgment?"
                answer="No. Research supports your judgment, it does not replace it. Section recommendations, precedents, and outcome patterns must be reviewed by qualified counsel before use in any filing or before any court. This is a hard rule of the product."
              />
              <FAQCard 
                question="How is client data kept confidential?"
                answer="Case data lives in isolated, encrypted storage in India with per-matter access controls. Every access is logged and visible to you, and your documents are never used to train models."
              />
              <FAQCard 
                question="How do I get access?"
                answer="Introspector is in closed pilot with a small group of practising lawyers and legal teams, starting with our external counsel network. Request early access or book a demo through the contact form and we will be in touch."
              />
            </div>
          </div>
        </section>

        {/* ================= CTA band ================= */}
        <section className="pad-t" id="contact">
          <div className="wrap">
            <div className="cta-band reveal">
              <div className="nglow"><svg><use href="#nmark"></use></svg></div>
              <h2>Give your practice<br />a research bench.</h2>
              <p>
                Judgment search, precedent discovery, citation intelligence, and AI research briefs, with a citation on every claim. Now in closed pilot for legal professionals.
              </p>
              <div className="btn-row">
                <a href="#contact" className="btn btn-gold">
                  Request early access 
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </a>
                <a href="#contact" className="btn btn-ghost">Book a demo</a>
                <a href="#contact" className="btn btn-ghost">Contact sales</a>
              </div>
              <div className="fine">Closed pilot · By invitation · Reviewed by qualified counsel</div>
            </div>
          </div>
        </section>
      </main>

      <Footer mode="introspector" />

      {/* Back to top FAB */}
      <button 
        className={`totop ${showToTop ? "show" : ""}`} 
        aria-label="Back to top"
        onClick={scrollToTop}
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 19V5M5 12l7-7 7 7"></path>
        </svg>
      </button>
    </div>
  );
}
