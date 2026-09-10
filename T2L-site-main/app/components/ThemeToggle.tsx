"use client";

import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
  const { mode, setMode } = useTheme();

  return (
    <label className={`theme-control${mobile ? " theme-control-mobile" : ""}`}>
      <span className="theme-control-label">Theme</span>
      <select
        value={mode}
        onChange={(event) => setMode(event.target.value as "light" | "dark" | "auto")}
        aria-label="Choose colour theme"
      >
        <option value="auto">Auto</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
