"use client";

import { useLanguage } from "@/context/LanguageContext";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  const { t } = useLanguage();

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2,
  );

  return (
    <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-lg bg-muted dark:text-gray-300 hover:brightness-90 disabled:opacity-30 disabled:cursor-not-allowed text-sm transition"
      >
        ← {t("video.previous")}
      </button>

      <div className="flex gap-1 flex-wrap justify-center">
        {visible.reduce<React.ReactNode[]>((acc, p, i) => {
          if (i > 0 && p - (visible[i - 1] as number) > 1) {
            acc.push(
              <span key={"el" + p} className="px-2 py-2 text-gray-500 text-sm">
                …
              </span>,
            );
          }
          acc.push(
            <button
              key={p}
              onClick={() => onChange(p)}
              className={
                "w-9 h-9 rounded-lg text-sm font-medium transition " +
                (p === page
                  ? "bg-primary text-white"
                  : "bg-muted dark:text-gray-300 hover:brightness-90")
              }
            >
              {p}
            </button>,
          );
          return acc;
        }, [])}
      </div>

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 rounded-lg bg-muted dark:text-gray-300 hover:brightness-90 disabled:opacity-30 disabled:cursor-not-allowed text-sm transition"
      >
        {t("video.next")} →
      </button>
    </div>
  );
}
