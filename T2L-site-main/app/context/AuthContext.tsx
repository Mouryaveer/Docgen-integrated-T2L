"use client";

// ============================================================
// Turn2Law — Auth Context
// Mock authentication for local development.
// Swap out loginUser / logoutUser for real API calls when
// the auth backend is ready — everything else stays the same.
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { User, AuthState } from "../types/docengine";

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginDemo: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USER: User = {
  id: "demo-001",
  name: "Mourya Veer",
  email: "mourya@turn2law.in",
  avatar: "MV",
  plan: "pro",
};

const SESSION_KEY = "t2l_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const user: User = JSON.parse(raw);
        setState({ user, isAuthenticated: true, isLoading: false });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    // TODO: replace with real API call
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    const user: User = {
      ...DEMO_USER,
      email,
      avatar: email.slice(0, 2).toUpperCase(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const loginDemo = useCallback(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(DEMO_USER));
    setState({ user: DEMO_USER, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loginDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
