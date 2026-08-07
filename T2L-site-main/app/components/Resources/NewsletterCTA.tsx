"use client";

import React, { useState } from 'react';
import { showToast } from '../ToastContainer';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /.+@.+\..+/.test(email)) {
      showToast('You are subscribed. Watch your inbox.');
      setEmail('');
    } else {
      showToast('Please enter a valid email');
      document.getElementById('nlEmail')?.focus();
    }
  };

  return (
    <>
      <section className="pad"><div className="wrap"><div className="newsletter reveal in">
  <div className="nglow"><svg><use href="#nmark"></use></svg></div>
  <h2>Never miss a deadline<br />or a development.</h2>
  <p>Get the week's legal updates, new resources, and upcoming events in one email. No noise, just what matters.</p>
  <form className="nl-form" id="nlForm" noValidate onSubmit={handleSubmit}>
    <input type="email" id="nlEmail" placeholder="you@company.com" aria-label="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
    <button type="submit" className="btn btn-gold">Subscribe</button>
  </form>
  <div className="nl-fine">Weekly · Unsubscribe anytime · No spam</div>
</div></div></section>
    </>
  );
}
