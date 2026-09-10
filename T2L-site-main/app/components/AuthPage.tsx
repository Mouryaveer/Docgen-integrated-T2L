"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { login, loginDemo, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !password || (isSignup && !name)) {
      setError("Please complete all required fields.");
      return;
    }
    setError("");
    await login(email, password);
    router.push("/dashboard");
  }

  async function handleDemo() {
    loginDemo();
    router.push("/dashboard");
  }

  return (
    <>
      <Navbar
        ctaText={isSignup ? "Log in" : "Create account"}
        ctaLink={isSignup ? "/login" : "/signup"}
        loginText={isSignup ? "Log in" : "Login"}
        loginLink="/login"
      />
      <main className="auth-shell">
        <section className="auth-card" aria-labelledby="auth-title">
          <span className="eyebrow">Turn2Law account</span>
          <h1 id="auth-title">{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p>{isSignup ? "Start using Turn2Law’s legal tools in one workspace." : "Sign in to continue to your Turn2Law workspace."}</p>
          <form onSubmit={handleSubmit} noValidate>
            {isSignup && (
              <label>
                Full name
                <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
              </label>
            )}
            <label>
              Email
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignup ? "new-password" : "current-password"} required />
            </label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="btn btn-gold" type="submit" disabled={isLoading}>
              {isLoading ? "Please wait…" : isSignup ? "Create account" : "Log in"}
              <span aria-hidden="true">→</span>
            </button>
          </form>
          <button className="auth-demo" type="button" onClick={handleDemo}>Continue with demo account</button>
          <p className="auth-switch">
            {isSignup ? "Already have an account?" : "New to Turn2Law?"} <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create an account"}</Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
