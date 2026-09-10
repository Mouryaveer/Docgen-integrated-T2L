"use client";

import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import styles from "./MarkdownResponse.module.css";

interface MarkdownResponseProps {
  content: string;
  className?: string;
}

function isSafeUrl(value: string): boolean {
  try {
    const url = new URL(value, "https://turn2law.in");
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function safeUrlTransform(value: string): string {
  return isSafeUrl(value) ? value : "";
}

const components: Components = {
  // Keep the model from creating oversized page-level headings inside a chat bubble.
  h1: ({ children }) => <h2>{children}</h2>,
  h2: ({ children }) => <h2>{children}</h2>,
  h3: ({ children }) => <h3>{children}</h3>,
  h4: ({ children }) => <h4>{children}</h4>,
  h5: ({ children }) => <h4>{children}</h4>,
  h6: ({ children }) => <h4>{children}</h4>,
  table: ({ children }) => (
    <div className={styles.tableWrap} role="region" aria-label="Response table" tabIndex={0}>
      <table>{children}</table>
    </div>
  ),
  pre: ({ children }) => <pre>{children}</pre>,
  a: ({ children, href }) => {
    if (!href || !isSafeUrl(href)) {
      return <span className={styles.unsafeLink}>{children}</span>;
    }

    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
};

export default function MarkdownResponse({ content, className }: MarkdownResponseProps) {
  const safeContent = typeof content === "string" ? content : "";

  return (
    <div className={[styles.content, className].filter(Boolean).join(" ")}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={components}
        skipHtml
        urlTransform={safeUrlTransform}
      >
        {safeContent}
      </ReactMarkdown>
    </div>
  );
}
