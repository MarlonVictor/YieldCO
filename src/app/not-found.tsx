"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-extrabold text-muted-foreground">404</h1>
      <p className="text-xl font-semibold">{t("404.title")}</p>
      <p className="text-sm text-muted-foreground">{t("404.message")}</p>
      <Button asChild>
        <Link href="/">{t("404.cta")}</Link>
      </Button>
    </div>
  );
}
