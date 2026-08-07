"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ResourcesHero from "../components/Resources/ResourcesHero";
import Subnav from "../components/Resources/Subnav";
import SearchResults from "../components/Resources/SearchResults";
import FeaturedCollections from "../components/Resources/FeaturedCollections";
import LatestNews from "../components/Resources/LatestNews";
import ComplianceUpdates from "../components/Resources/ComplianceUpdates";
import Events from "../components/Resources/Events";
import CaseLaw from "../components/Resources/CaseLaw";
import ActsRegulations from "../components/Resources/ActsRegulations";
import Templates from "../components/Resources/Templates";
import GovernmentPortals from "../components/Resources/GovernmentPortals";
import FreeResources from "../components/Resources/FreeResources";
import Learning from "../components/Resources/Learning";
import ResearchPapers from "../components/Resources/ResearchPapers";
import Media from "../components/Resources/Media";
import Courses from "../components/Resources/Courses";
import Glossary from "../components/Resources/Glossary";
import Timeline from "../components/Resources/Timeline";
import NewsletterCTA from "../components/Resources/NewsletterCTA";
import ToastContainer from "../components/ToastContainer";

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 1. Reveal Animations
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const elements = document.querySelectorAll(".reveal:not(.in)");
    elements.forEach((el) => revealObserver.observe(el));

    // 2. Sticky Subnav Scrollspy
    const sections = document.querySelectorAll("section[id]");
    const subLinks = document.querySelectorAll("#subnavTrack a");
    const subnavTrackEl = document.getElementById("subnavTrack");
    let curId = "";
    let prevId = "";

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            const id = entry.target.getAttribute("id");
            if (id) {
              subLinks.forEach((a) => a.classList.remove("on"));
              const active = document.querySelector(`#subnavTrack a[href="#${id}"]`);
              if (active) active.classList.add("on");
              curId = id;
            }
          }
        });

        if (curId !== prevId) {
          prevId = curId;
          subLinks.forEach((a) => {
            if (a.classList.contains("on") && subnavTrackEl) {
              const aEl = a as HTMLElement;
              const sl =
                aEl.offsetLeft -
                subnavTrackEl.offsetWidth / 2 +
                aEl.offsetWidth / 2;
              subnavTrackEl.scrollTo({ left: sl, behavior: "smooth" });
            }
          });
        }
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0.1 }
    );

    sections.forEach((sec) => scrollObserver.observe(sec));

    return () => {
      revealObserver.disconnect();
      scrollObserver.disconnect();
    };
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <>
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", overflow: "hidden" }}
        aria-hidden="true"
      >
        <symbol id="nmark" viewBox="0 0 96 118">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 108 V26 L70 100 V34"></path>
            <path d="M49 44 L70 18 L91 44"></path>
          </g>
        </symbol>
      </svg>

      <a href="#top" className="skip-link">
        Skip to content
      </a>

      <Navbar />

      <main id="top">
        <ResourcesHero onSearch={setSearchQuery} />
        {!isSearching && <Subnav />}

        {isSearching ? (
          <SearchResults query={searchQuery} onClear={() => setSearchQuery('')} />
        ) : (
          <div id="browse">
            <FeaturedCollections />
            <LatestNews />
            <ComplianceUpdates />
            <Events />
            <CaseLaw />
            <ActsRegulations />
            <Templates />
            <GovernmentPortals />
            <FreeResources />
            <Learning />
            <ResearchPapers />
            <Media />
            <Courses />
            <Glossary />
            <Timeline />
          </div>
        )}
        <NewsletterCTA />
      </main>

      <Footer />
      <ToastContainer />
    </>
  );
}

