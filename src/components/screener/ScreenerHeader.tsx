"use client";

import { useLanguage } from "@/context/LanguageContext";

interface ScreenerHeaderProps {
  total: number;
}

export function ScreenerHeader({ total }: ScreenerHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">{t("stocks.title")}</h1>
      <p className="text-sm text-muted-foreground">
        {total} {t("stocks.subtitle")}.
      </p>
    </div>
  );
}
