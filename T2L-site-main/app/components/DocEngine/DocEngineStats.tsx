"use client";

import React from "react";

export default function DocEngineStats() {
  return (
    <section className="wrap" style={{ marginTop: "-28px", position: "relative", zIndex: 5 }}>
      <div className="stats reveal">
        <div className="stat">
          <div className="v">13+</div>
          <div className="k">Ready templates</div>
        </div>
        <div className="stat">
          <div className="v">&lt; 60s</div>
          <div className="k">To a first draft</div>
        </div>
        <div className="stat">
          <div className="v">PDF &amp; DOCX</div>
          <div className="k">Export, versioned</div>
        </div>
      </div>
    </section>
  );
}
