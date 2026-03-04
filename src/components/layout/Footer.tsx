"use client";

import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto px-4 py-4 border-t border-border">
      <p className="text-xs text-muted-foreground text-center">
        {t("footer.text")}
      </p>
    </footer>
  );
}
