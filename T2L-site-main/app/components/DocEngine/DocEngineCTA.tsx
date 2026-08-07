"use client";

import React from "react";

export default function DocEngineCTA() {
  return (
    <section className="pad-t">
      <div className="wrap">
        <div className="cta-band reveal">
          <div className="nglow">
            <svg>
              <use href="#nmark"></use>
            </svg>
          </div>
          <h2>Draft your next document in minutes.</h2>
          <p>
            Plain language in, an India-specific drafted document out, with risk flags and e-signature built in.
          </p>
          <div className="btn-row">
            <a href="/signup.html" className="btn btn-gold">
              Get started
            </a>
            <a
              href="/#contact"
              className="btn btn-ghost"
              style={{
                background: "rgba(255,255,255,.08)",
                color: "#fff",
                borderColor: "rgba(255,255,255,.2)",
              }}
            >
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
