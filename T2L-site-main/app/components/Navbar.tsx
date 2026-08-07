"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  ctaText?: string;
  ctaLink?: string;
  loginText?: string;
  loginLink?: string;
}

export default function Navbar({
  ctaText = "Get Started",
  ctaLink = "#contact",
  loginText = "Login",
  loginLink = "#"
}: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Monitor scroll position for shrinking navbar and progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const st = window.scrollY || document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;

      // Update sticky class state
      setScrolled(st > 20);

      // Update progress bar
      setScrollProgress(h > 0 ? st / h : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Trigger initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Sync menuOpen state to body class
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Focus trap inside open mobile menu
  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !menuOpen || !menuRef.current) return;

    const focusableElements = menuRef.current.querySelectorAll<
      HTMLAnchorElement | HTMLButtonElement
    >("a, button");
    if (!focusableElements.length) return;

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div
        className="progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* Header / Navbar */}
      <header className={`nav ${scrolled ? "scrolled" : ""}`} id="nav">
        <div className="nav-inner">
          <Link href="/" className="brand" aria-label="Turn2Law home">
            <Image
              className="brand-logo"
              src="/turn2law-logo.png"
              alt="Turn2Law"
              width={180}
              height={51}
              priority
            />
          </Link>

          <nav className="nav-links" aria-label="Primary">
            <Link href="/legal-services" className={pathname === "/legal-services" ? "active" : ""}>
              Legal Services
            </Link>
            <Link href="/docengine" className={pathname === "/docengine" ? "active" : ""}>
              Doc Engine
            </Link>
            <Link href="/introspector" className={pathname === "/introspector" ? "active" : ""}>
              Introspector
            </Link>
            <Link href="/resources" className={pathname === "/resources" ? "active" : ""}>
              Resources
            </Link>
          </nav>

          <div className="nav-cta">
            <Link href={loginLink} className="nav-login">
              {loginText}
            </Link>
            <Link href={ctaLink} className="btn btn-gold">
              {ctaText}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M17 7H7M17 7v10"></path>
              </svg>
            </Link>
            <button
              ref={burgerRef}
              className="burger"
              id="burger"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <nav
        ref={menuRef}
        className="mobile-menu"
        id="mobileMenu"
        aria-label="Mobile"
        onKeyDown={handleMenuKeyDown}
      >
        <Link href="/" className={pathname === "/" ? "active" : ""} onClick={() => setMenuOpen(false)}>
          Legal Services
        </Link>
        <Link href="/docengine" className={pathname === "/docengine" ? "active" : ""} onClick={() => setMenuOpen(false)}>
          Doc Engine
        </Link>
        <Link href="/introspector" className={pathname === "/introspector" ? "active" : ""} onClick={() => setMenuOpen(false)}>
          Introspector
        </Link>
        <Link href="/resources" className={pathname === "/resources" ? "active" : ""} onClick={() => setMenuOpen(false)}>
          Resources
        </Link>
        <div className="mm-actions">
          <Link href={loginLink} className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
            {loginText}
          </Link>
          <Link href={ctaLink} className="btn btn-gold" onClick={() => setMenuOpen(false)}>
            {ctaText}
          </Link>
        </div>
      </nav>
    </>
  );
}
