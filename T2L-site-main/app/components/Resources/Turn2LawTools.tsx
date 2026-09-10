import React from "react";

const tools = [
  {
    name: "Legal Templates",
    category: "Legal Documents / Templates",
    description: "Create, customize, and access professionally structured legal document templates for common business and legal requirements.",
    href: "https://legal-templates-lyart.vercel.app/",
    cta: "Explore Legal Templates",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    name: "Startup Legal Health Checker",
    category: "Startup Legal / Compliance",
    description: "Evaluate your startup's legal readiness, identify potential compliance gaps, and understand important legal areas that may require attention.",
    href: "https://startup-legal-health-checker.vercel.app/",
    cta: "Check Startup Legal Health",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6z" />
        <path d="m8.5 12 2.2 2.2 4.8-4.8" />
      </svg>
    ),
  },
];

export default function Turn2LawTools() {
  return (
    <section id="tools" className="pad-s tools-section" aria-labelledby="tools-title">
      <div className="wrap">
        <div className="shead reveal">
          <div className="st">
            <div className="sicon"><span aria-hidden="true">✦</span></div>
            <div>
              <h2 id="tools-title">Turn2Law Tools</h2>
              <div className="sdesc">Official tools for documents, compliance, and startup readiness</div>
            </div>
          </div>
          <span className="tools-kicker">Featured Turn2Law tools</span>
        </div>

        <div className="tools-grid">
          {tools.map((tool) => (
            <article className="tool-card reveal" key={tool.name}>
              <div className="tool-card-icon">{tool.icon}</div>
              <div className="tool-card-copy">
                <span className="tool-card-category">{tool.category}</span>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </div>
              <a className="tool-card-link" href={tool.href} target="_blank" rel="noopener noreferrer" aria-label={`${tool.cta} (opens in a new tab)`}>
                {tool.cta}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
