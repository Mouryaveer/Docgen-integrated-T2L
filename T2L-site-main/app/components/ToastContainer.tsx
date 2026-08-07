"use client";

import React, { useState, useEffect } from 'react';

// Simple global event emitter for toasts
type ToastEvent = { detail: string };

export function showToast(message: string) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('t2l-toast', { detail: message });
    window.dispatchEvent(event);
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const msg = (e as CustomEvent).detail;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message: msg }]);

      // Remove after 3.5s (like original animation)
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };

    window.addEventListener('t2l-toast', handleToast);
    return () => window.removeEventListener('t2l-toast', handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {toasts.map((t) => (
        <div key={t.id} className="toast in" style={{ opacity: 1, transform: 'none' }}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
