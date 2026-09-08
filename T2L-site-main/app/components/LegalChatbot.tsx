"use client";

import React, { useState, useEffect, useRef } from "react";
import { sendLegalQuery, checkBackendHealth } from "../services/chatApi";
import { useKeepAlive } from "../hooks/useKeepAlive";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  modelUsed?: string;
  timestamp: string;
  isError?: boolean;
}

const SAMPLE_QUERIES = [
  "What is the punishment for cyber fraud under the IT Act?",
  "Explain IPC Section 420 and its bail conditions.",
  "Is anticipatory bail available under the BNSS?",
  "What are essential terms in a commercial lease under Indian law?",
];

export default function LegalChatbot() {
  useKeepAlive(); // Pings backend every 4 min to prevent Render free-tier cold starts
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      text: "Hello! I am **Turn2Law Legal AI**, grounded in Indian law, statutes, and judicial precedents. Ask me any legal query.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      try {
        await checkBackendHealth();
        if (isMounted) setIsBackendOnline(true);
      } catch {
        if (isMounted) setIsBackendOnline(false);
      }
    }

    if (isOpen) {
      checkHealth();
      const interval = setInterval(checkHealth, 30_000);
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }
  }, [isOpen]);

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryToSend) setInputQuery("");
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const responseData = await sendLegalQuery(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          text: responseData.response,
          modelUsed: responseData.model_used,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setIsBackendOnline(true);
    } catch (err: unknown) {
      const errorText =
        err instanceof Error ? err.message : "Failed to process legal query.";
      setErrorMessage(errorText);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "assistant",
          text: `⚠️ **Error**: ${errorText}`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "assistant",
        text: "Conversation cleared. How can I assist you with Indian legal research today?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setErrorMessage(null);
  };

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-[#0A1628] text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl hover:shadow-[0_0_25px_rgba(216,171,91,0.45)] border border-[#D8AB5B]/40 transition-all duration-300 transform hover:-translate-y-1"
          aria-label="Open Turn2Law Legal AI Chatbot"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D8AB5B] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D8AB5B]" />
          </span>
          <div className="text-left">
            <div className="text-xs font-semibold text-white leading-none">
              TURN2LAW AI
            </div>
            <div className="text-[10px] text-gray-400 leading-none mt-0.5">
              Legal Assistant
            </div>
          </div>
          <svg
            className="w-4 h-4 text-[#D8AB5B] ml-1 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Chat drawer */}
      {isOpen && (
        <div className="w-[380px] h-[560px] bg-[#060D1A] border border-[#D8AB5B]/25 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-[#0A1628]/80 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D8AB5B] to-[#B98F42] flex items-center justify-center text-lg flex-shrink-0">
              ⚖️
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white leading-none">
                Turn2Law Legal AI
              </h3>
              {isBackendOnline !== null && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full mt-1 inline-block ${
                    isBackendOnline
                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                      : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {isBackendOnline ? "● RAG Online" : "● Check Backend"}
                </span>
              )}
              <p className="text-[10px] text-gray-500 leading-none mt-0.5">
                Grounded in Indian Law &amp; Precedents
              </p>
            </div>
            <button
              onClick={clearChat}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-[#D8AB5B] to-[#B98F42] text-black rounded-br-sm"
                      : msg.isError
                      ? "bg-red-900/30 border border-red-500/30 text-red-300 rounded-bl-sm"
                      : "bg-[#0E1C31] border border-white/8 text-gray-200 rounded-bl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.modelUsed && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                      <span className="text-[10px] text-gray-500 font-mono">
                        Model: {msg.modelUsed}
                      </span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-[10px] text-gray-500 hover:text-[#D8AB5B] transition-colors ml-2"
                      >
                        {copiedId === msg.id ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                  )}
                  <div className="text-[10px] text-gray-500 mt-1 text-right">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#0E1C31] border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#D8AB5B] animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      Searching Indian legal database…
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions */}
            {messages.length <= 2 && !isLoading && (
              <div className="mt-2">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                  Suggested Legal Topics:
                </p>
                <div className="flex flex-col gap-1.5">
                  {SAMPLE_QUERIES.map((sq) => (
                    <button
                      key={sq}
                      onClick={() => void handleSend(sq)}
                      className="text-xs bg-white/5 hover:bg-[#D8AB5B]/15 hover:border-[#D8AB5B]/40 text-gray-300 hover:text-[#D8AB5B] px-3 py-2 rounded-lg border border-white/10 transition-all text-left"
                    >
                      {sq}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error banner */}
          {errorMessage && !isLoading && (
            <div className="mx-3 mb-2 px-3 py-2 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center justify-between gap-2 text-xs text-red-400">
              <span className="truncate">⚠ {errorMessage}</span>
              <button
                onClick={() => void handleSend()}
                className="underline hover:text-white font-medium shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-white/8 bg-[#0A1628]/50">
            <form
              onSubmit={(e) => { e.preventDefault(); void handleSend(); }}
              className="flex items-end gap-2"
            >
              <textarea
                ref={textareaRef}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your legal question... (Press Enter to send)"
                rows={2}
                disabled={isLoading}
                className="flex-1 bg-[#0A1628] text-white text-sm placeholder-gray-500 rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#D8AB5B] focus:outline-none focus:ring-1 focus:ring-[#D8AB5B] resize-none transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="bg-gradient-to-r from-[#D8AB5B] to-[#B98F42] hover:from-[#B98F42] hover:to-[#D8AB5B] text-black font-semibold p-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md flex items-center justify-center shrink-0"
                aria-label="Send query"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-gray-500 font-mono">
              <span>Press Shift+Enter for newline</span>
              <span>Turn2Law RAG v1.0</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
