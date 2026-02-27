"use client";

import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";

// Ícone GitHub (SVG inline para não precisar de lib)
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// Ícone Sol
function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

// Ícone Lua
function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const { toggleLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Evitar hydration mismatch com next-themes
  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <header
      className="
      fixed top-0 right-0 left-0 md:left-56
      h-14 border-b border-border bg-background
      flex items-center justify-end
      px-4 gap-2 z-20
    "
    >
      {/* GitHub */}
      <a
        href="https://github.com/MarlonVictor/YieldCO"
        target="_blank"
        rel="noopener noreferrer"
        title={t("header.github_tooltip")}
        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
      >
        <GithubIcon />
      </a>

      {/* Dark mode toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          title={t("header.darkmode_tooltip")}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      )}

      {/* Language toggle */}
      <button
        onClick={toggleLang}
        className="
          px-3 py-1.5 rounded-md text-xs font-medium
          border border-border
          text-muted-foreground hover:text-foreground hover:bg-accent/50
          transition-colors
        "
      >
        {t("header.lang_toggle")}
      </button>
    </header>
  );
}
