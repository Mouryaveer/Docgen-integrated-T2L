"use client";

import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DocEngineHero from "../components/DocEngine/DocEngineHero";
import DocEngineStats from "../components/DocEngine/DocEngineStats";
import DocEngineFlow from "../components/DocEngine/DocEngineFlow";
import DocEngineTemplates from "../components/DocEngine/DocEngineTemplates";
import DocEngineFeatures from "../components/DocEngine/DocEngineFeatures";
import DocEngineResponsibleUse from "../components/DocEngine/DocEngineResponsibleUse";
import DocEngineFAQ from "../components/DocEngine/DocEngineFAQ";
import DocEngineCTA from "../components/DocEngine/DocEngineCTA";

export default function DocEngine() {
  // Intersection Observer for scroll reveal animations
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

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="nmark" viewBox="0 0 96 118">
          <g fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 108 V26 L70 100 V34"></path>
            <path d="M49 44 L70 18 L91 44"></path>
          </g>
        </symbol>
      </svg>

      <a href="#top" className="skip-link">Skip to content</a>

      <Navbar />

      <main id="top">
        <DocEngineHero />
        <DocEngineStats />
        <DocEngineFlow />
        <DocEngineTemplates />
        <DocEngineFeatures />
        <DocEngineResponsibleUse />
        <DocEngineFAQ />
        <DocEngineCTA />
      </main>

      <Footer />
    </>
  );
}
