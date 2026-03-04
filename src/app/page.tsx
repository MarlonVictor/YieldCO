"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, BarChart2, Search, Zap } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function RootPage() {
  const { t } = useLanguage();

  const FEATURES = [
    {
      icon: <Search className="h-5 w-5 text-emerald-600" />,
      title: t("home.feature_1.title"),
      desc: t("home.feature_1.description"),
    },
    {
      icon: <BarChart2 className="h-5 w-5 text-emerald-600" />,
      title: t("home.feature_2.title"),
      desc: t("home.feature_2.description"),
    },
    {
      icon: <Zap className="h-5 w-5 text-emerald-600" />,
      title: t("home.feature_3.title"),
      desc: t("home.feature_3.description"),
    },
  ];

  return (
    <section className="h-max pt-6">
      {/* Hero */}
      <div className="text-center">
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
          {t("home.tag")}
        </span>

        <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
          {t("home.title.line1")}{" "}
          <span className="text-emerald-600">{t("home.title.line2")}</span>
          <br />
          {t("home.title.line3")}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          {t("home.paragraph")}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Link href="/screener">
              {t("home.cta_stocks")} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href="https://github.com/MarlonVictor/YieldCO"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("home.cta_github")}
            </a>
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="mt-20 grid gap-6 sm:grid-cols-3">
        <Suspense
          fallback={Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                {f.icon}
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </Suspense>
      </div>
    </section>
  );
}
