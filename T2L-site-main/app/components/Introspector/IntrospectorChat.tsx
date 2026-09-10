"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import MarkdownResponse from "../MarkdownResponse";

/**
 * Introspector live chat client.
 *
 * Talks to the same-origin proxy at `/api/introspector`, which forwards to the
 * RAG backend's `POST /api/query`. Same-origin means no CORS handling here and
 * the real backend URL is never exposed to the browser.
 *
 * Styling uses inline tokens matching the Turn2Law dark/gold palette so the
 * component is self-contained and drops cleanly into the existing Introspector
 * page without depending on that page's CSS classes.
 */

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const GOLD = "#c9a227";
const SURFACE = "#111114";
const SURFACE_2 = "#1a1a1f";
const BORDER = "#2a2a30";
const TEXT = "#ece9e2";
const TEXT_DIM = "#a8a49b";

const SUGGESTIONS = [
  "Is anticipatory bail available for a non-bailable offence under the BNSS?",
  "What does Article 21 of the Constitution protect?",
  "What are the essentials of a valid contract?",
];

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function IntrospectorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (raw: string) => {
      const query = raw.trim();
      if (!query || loading) return;

      setError(null);
      const userMessage: ChatMessage = { id: newId(), role: "user", content: query };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/introspector", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          signal: AbortSignal.timeout(130_000),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const detail =
            (data && (data.error || data.detail)) ||
            "Something went wrong while contacting Introspector.";
          setError(typeof detail === "string" ? detail : "Request failed.");
          return;
        }

        const answer =
          (data && (data.response as string)) ??
          "Introspector returned an empty response.";
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "assistant", content: answer },
        ]);
      } catch (err) {
        const isTimeout = err instanceof Error && err.name === "TimeoutError";
        setError(
          isTimeout
            ? "Introspector is waking up from sleep — this can take up to 60 seconds on first use. Please try again in a moment."
            : "Network error. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
        textareaRef.current?.focus();
      }
    },
    [loading],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  const empty = messages.length === 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: 560,
        maxWidth: 860,
        margin: "0 auto",
        width: "100%",
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 24px",
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: GOLD,
            boxShadow: `0 0 12px ${GOLD}`,
          }}
        />
        <div>
          <div style={{ color: TEXT, fontWeight: 600, fontSize: 16 }}>Introspector</div>
          <div style={{ color: TEXT_DIM, fontSize: 12 }}>
            AI legal research grounded in Indian law
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
      >
        {empty && (
          <div style={{ margin: "auto", textAlign: "center", maxWidth: 520 }}>
            <div style={{ color: TEXT, fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
              Ask a legal question
            </div>
            <div style={{ color: TEXT_DIM, fontSize: 14, marginBottom: 24 }}>
              Introspector answers using Indian legal documents. Not a substitute
              for advice from a qualified lawyer.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    background: SURFACE_2,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    color: TEXT_DIM,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              padding: "12px 16px",
              borderRadius: 12,
              background: m.role === "user" ? GOLD : SURFACE_2,
              color: m.role === "user" ? "#1a1500" : TEXT,
              border: m.role === "user" ? "none" : `1px solid ${BORDER}`,
              lineHeight: 1.55,
              fontSize: 14.5,
            }}
          >
            {m.role === "assistant" ? (
              <MarkdownResponse content={m.content} />
            ) : (
              m.content
            )}
          </div>
        ))}

        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              padding: "12px 16px",
              borderRadius: 12,
              background: SURFACE_2,
              border: `1px solid ${BORDER}`,
              color: TEXT_DIM,
              fontSize: 14,
            }}
          >
            Introspector is thinking…
          </div>
        )}

        {error && (
          <div
            role="alert"
            style={{
              alignSelf: "stretch",
              padding: "12px 16px",
              borderRadius: 12,
              background: "rgba(180, 40, 40, 0.12)",
              border: "1px solid rgba(180, 40, 40, 0.4)",
              color: "#f2b8b8",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={onSubmit}
        style={{
          borderTop: `1px solid ${BORDER}`,
          padding: 16,
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about Indian law…  (Enter to send, Shift+Enter for a new line)"
          rows={1}
          disabled={loading}
          aria-label="Your legal question"
          style={{
            flex: 1,
            resize: "none",
            maxHeight: 160,
            padding: "12px 14px",
            background: SURFACE_2,
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            color: TEXT,
            fontSize: 14.5,
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading || input.trim().length === 0}
          style={{
            padding: "12px 20px",
            background: loading || input.trim().length === 0 ? BORDER : GOLD,
            color: loading || input.trim().length === 0 ? TEXT_DIM : "#1a1500",
            border: "none",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14.5,
            cursor: loading || input.trim().length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
