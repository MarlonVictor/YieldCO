"use client";

import { useLanguage } from "@/context/LanguageContext";

interface ScreenerHeaderProps {
  total: number;
  isReit?: boolean;
}

export function ScreenerHeader({ total, isReit }: ScreenerHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">
        {isReit ? t("fiis.title") : t("stocks.title")}
      </h1>
      <p className="text-sm text-muted-foreground">
        {total} {isReit ? t("fiis.subtitle") : t("stocks.subtitle")}.
      </p>
    </div>
  );
}
