"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import "./dashboard.css";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "My Documents",
    href: "/dashboard/documents",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
  {
    label: "New Document",
    href: "/dashboard/doc-engine/create",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    badge: "AI",
  },
  {
    label: "Templates",
    href: "/dashboard/doc-engine/templates",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    label: "Branding",
    href: "/dashboard/doc-engine/branding",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    label: "Digital Signatures",
    href: "/dashboard/doc-engine/signatures",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

const BOTTOM_ITEMS: NavItem[] = [
  {
    label: "Legal Services",
    href: "/legal-services",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    label: "Introspector",
    href: "/introspector",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, loginDemo } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginDemo();
    }
  }, [isLoading, isAuthenticated, loginDemo]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="dash-loading">
        <div className="dash-spinner" />
      </div>
    );
  }

  return (
    <div className={`dash-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="dash-sidebar" aria-label="Dashboard navigation">
        <div className="dash-sidebar-logo">
          <Link href="/" aria-label="Turn2Law home">
            <Image
              src="/turn2law-logo.png"
              alt="Turn2Law"
              width={130}
              height={37}
              priority
            />
          </Link>
          <button
            className="dash-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="dash-nav-label">Doc Engine</div>

        <nav className="dash-nav" aria-label="Primary dashboard">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="dash-nav-icon">{item.icon}</span>
                <span className="dash-nav-label-text">{item.label}</span>
                {item.badge && (
                  <span className="dash-nav-badge">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="dash-nav-divider" />
        <div className="dash-nav-label">Platform</div>

        <nav className="dash-nav" aria-label="Other sections">
          {BOTTOM_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="dash-nav-item"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="dash-nav-icon">{item.icon}</span>
              <span className="dash-nav-label-text">{item.label}</span>
            </Link>
          ))}
        </nav>

        {user && (
          <div className="dash-user-card">
            <div className="dash-user-av">{user.avatar}</div>
            <div className="dash-user-info">
              <div className="dash-user-name">{user.name}</div>
              <div className="dash-user-email">{user.email}</div>
            </div>
            <button
              className="dash-user-logout"
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign out"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </div>
        )}
      </aside>

      {sidebarOpen && (
        <div
          className="dash-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="dash-main">
        <header className="dash-topbar">
          <button
            className="dash-burger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="dash-topbar-title">
            <BreadCrumb pathname={pathname} />
          </div>

          <div className="dash-topbar-actions">
            <Link
              href="/dashboard/doc-engine/create"
              className="btn btn-gold dash-new-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Document
            </Link>

            {user && (
              <div className="dash-topbar-av" title={user.name}>
                {user.avatar}
              </div>
            )}
          </div>
        </header>

        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}

function BreadCrumb({ pathname }: { pathname: string }) {
  const segments = pathname.replace("/dashboard", "").split("/").filter(Boolean);
  const labels: Record<string, string> = {
    "doc-engine": "Doc Engine",
    create: "New Document",
    review: "Review",
    preview: "Preview",
    sign: "Sign",
    history: "History",
    documents: "My Documents",
    templates: "Templates",
    branding: "Branding",
    signatures: "Digital Signatures",
  };

  if (segments.length === 0) {
    return <span>Overview</span>;
  }

  return (
    <span className="dash-breadcrumb">
      <Link href="/dashboard">Dashboard</Link>
      {segments.map((seg, i) => (
        <React.Fragment key={i}>
          <span className="dash-bc-sep">/</span>
          <span>{labels[seg] ?? seg}</span>
        </React.Fragment>
      ))}
    </span>
  );
}
