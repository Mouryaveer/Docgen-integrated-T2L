"use client";

import React, { useState, useRef } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    consent: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    email: "",
    message: "",
    consent: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fn = formData.firstName.trim();
    const em = formData.email.trim();
    const msg = formData.message.trim();
    const consent = formData.consent;

    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

    const newErrors = {
      firstName: fn ? "" : "Please enter your first name.",
      email: em ? (okEmail ? "" : "Enter a valid email address.") : "Please enter your email.",
      message: msg ? "" : "Please tell us what you need help with.",
      consent: consent ? "" : "Please accept the Privacy Policy to continue.",
    };

    setErrors(newErrors);

    let firstBad: "firstName" | "email" | "message" | "consent" | null = null;
    if (!fn) firstBad = "firstName";
    else if (!em || !okEmail) firstBad = "email";
    else if (!msg) firstBad = "message";
    else if (!consent) firstBad = "consent";

    if (firstBad) {
      if (firstBad === "firstName") firstNameRef.current?.focus();
      else if (firstBad === "email") emailRef.current?.focus();
      else if (firstBad === "message") messageRef.current?.focus();
      else if (firstBad === "consent") consentRef.current?.focus();
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
        consent: false,
      });
    }, 700);
  };

  return (
    <form className="form" id="contactForm" noValidate onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="fn">First name</label>
        <input
          ref={firstNameRef}
          id="fn"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="Ananya"
          autoComplete="given-name"
          required
          aria-required="true"
          aria-invalid={errors.firstName ? "true" : undefined}
          aria-describedby={errors.firstName ? "fnErr" : undefined}
        />
        <small className={`ferr ${errors.firstName ? "show" : ""}`} id="fnErr" role="alert">
          {errors.firstName}
        </small>
      </div>

      <div className="field">
        <label htmlFor="ln">Last name</label>
        <input
          id="ln"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Rao"
          autoComplete="family-name"
        />
      </div>

      <div className="field full">
        <label htmlFor="em">Email</label>
        <input
          ref={emailRef}
          id="em"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="you@company.in"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={errors.email ? "true" : undefined}
          aria-describedby={errors.email ? "emErr" : undefined}
        />
        <small className={`ferr ${errors.email ? "show" : ""}`} id="emErr" role="alert">
          {errors.email}
        </small>
      </div>

      <div className="field full">
        <label htmlFor="msg">Message</label>
        <textarea
          ref={messageRef}
          id="msg"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Tell us what you need help with..."
          required
          aria-required="true"
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? "msgErr" : undefined}
        />
        <small className={`ferr ${errors.message ? "show" : ""}`} id="msgErr" role="alert">
          {errors.message}
        </small>
      </div>

      <label className="consent">
        <input
          ref={consentRef}
          type="checkbox"
          id="consent"
          name="consent"
          checked={formData.consent}
          onChange={handleInputChange}
          required
          aria-required="true"
        />
        <span>
          I agree to the <a href="#">Privacy Policy</a> and consent to Turn2Law contacting me about my enquiry.
        </span>
      </label>
      <small 
        className={`ferr ${errors.consent ? "show" : ""}`} 
        id="consentErr" 
        role="alert" 
        style={{ gridColumn: "1/-1", marginTop: "-6px" }}
      >
        {errors.consent}
      </small>

      {!isSubmitted && (
        <button 
          className="btn btn-gold send" 
          type="submit"
          disabled={isSending}
        >
          {isSending ? "Sending…" : "Send message"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"></path>
          </svg>
        </button>
      )}

      <div 
        className="form-ok" 
        id="formOk" 
        style={{ display: isSubmitted ? "flex" : "none" }}
      >
        <svg viewBox="0 0 24 24">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <path d="M22 4 12 14.01l-3-3"></path>
        </svg>
        <span>Thank you. Your message has been received, we will write back shortly.</span>
      </div>
    </form>
  );
}
