"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { TrendingUp } from "lucide-react";

const NAV_ITEMS = [
  { key: "sidebar.nav.home", href: "/" },
  { key: "sidebar.nav.stocks", href: "/acoes" },
  { key: "sidebar.nav.fiis", href: "/fiis" },
  // { key: "sidebar.nav.calculators", href: "" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside
      className="
      hidden md:flex flex-col
      fixed top-0 left-0 h-screen 
      border-r border-border bg-background
      w-56 z-30
    "
    >
      {/* Logo */}
      <div className="px-6 border-b border-border h-[5.5rem] flex flex-col items-start justify-center">
        <Link
          href="/"
          className="flex items-center font-bold text-lg text-foreground"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white mr-2">
            <TrendingUp className="h-4 w-4" />
          </span>
          Yield<span className="text-emerald-600">.co</span>
        </Link>

        <p className="text-xs text-muted-foreground mt-2">
          {t("sidebar.tagline")}
        </p>
      </div>

      {/* Navegação */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {NAV_ITEMS.map(({ key, href }) => {
          const active = href && pathname === href;
          return (
            <Link
              key={key}
              href={href}
              onClick={(e) => !href && e.preventDefault()}
              className={`
                px-3 py-2 rounded-md text-sm transition-colors
                ${
                  active
                    ? "bg-accent text-accent-foreground font-medium border-l-2 border-primary pl-[10px]"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }
                ${!href ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {t(key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
