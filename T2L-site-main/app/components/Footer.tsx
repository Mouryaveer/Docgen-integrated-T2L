"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  mode?: "default" | "introspector";
}

export default function Footer({ mode = "default" }: FooterProps) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link href="/" className="brand" aria-label="Turn2Law home">
              <Image
                className="brand-logo"
                src="/turn2law-logo.png"
                alt="Turn2Law"
                width={106}
                height={30}
                style={{ height: "30px", width: "auto" }}
              />
            </Link>
            <p>
              India&apos;s Legal OS. One platform for the founder who cannot afford a lawyer on retainer and the lawyer who cannot afford a bench.
            </p>
          </div>
          
          <div className="foot-col">
            <h4>Products</h4>
            <Link href="/">Legal Services</Link>
            <Link href="/docengine">Doc Engine</Link>
            <Link href="/introspector">Introspector</Link>
          </div>

          {mode === "introspector" ? (
            <div className="foot-col">
              <h4>Introspector</h4>
              <a href="#workflows">Workflows</a>
              <a href="#security">Security</a>
              <a href="#faq">FAQ</a>
              <Link href="/#contact">Request access</Link>
            </div>
          ) : (
            <div className="foot-col">
              <h4>Company</h4>
              <a href="#products">Platform</a>
              <Link href="/resources">Resources</Link>
              <a href="#contact">Contact</a>
              <a href="https://www.linkedin.com/company/turn2law" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          )}

          {mode === "introspector" ? (
            <div className="foot-col">
              <h4>Get started</h4>
              <Link href="/#contact">Book a demo</Link>
              <Link href="/#contact">Contact sales</Link>
              <Link href="/introspector">For lawyers</Link>
              <a href="mailto:hello@turn2law.in">hello@turn2law.in</a>
            </div>
          ) : (
            <div className="foot-col">
              <h4>Get started</h4>
              <a href="#contact">Talk to us</a>
              <a href="#">For founders</a>
              <a href="#">For lawyers</a>
              <a href="mailto:hello@turn2law.in">hello@turn2law.in</a>
            </div>
          )}
        </div>

        <div className="foot-statutory">
          Effivia Turn2Law Legal Pvt. Ltd.&nbsp;·&nbsp;CIN: U63110DL2025PTC443434&nbsp;
        </div>

        <p className="foot-disc">
          Turn2Law is a technology platform, not a law firm, and does not provide legal representation. Information here is not legal advice. AI output is decision support and must be reviewed by qualified counsel before use in any filing.
        </p>

        <div className="foot-bottom">
          <div className="cr">© 2026 Effivia Turn2Law Legal Pvt. Ltd. All rights reserved.</div>
          <div className="foot-social">
            <a
              href="https://www.linkedin.com/company/turn2law"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="11"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="mailto:hello@turn2law.in" aria-label="Email">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                <path d="m3 7 9 6 9-6"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
