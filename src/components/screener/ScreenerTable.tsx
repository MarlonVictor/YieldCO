"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChangeCell } from "./ChangeCell";
import {
  formatBRL,
  formatBillions,
  formatMultiple,
  formatPercent,
} from "@/utils/format";
import { useRef, useState } from "react";
import type { Quote } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/utils/cn";

interface ScreenerTableProps {
  data: Quote[];
}

export function ScreenerTable({ data }: ScreenerTableProps) {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  function handleScroll() {
    setScrolled((scrollRef.current?.scrollTop ?? 0) > 0);
  }

  if (!data.length) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        {t("screener.no_assets_found")}
      </p>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="overflow-auto rounded-xl border border-border max-h-[calc(100vh-16rem)]"
    >
      <Table>
        <TableHeader
          className={cn(
            "sticky top-0 z-20 transition-colors",
            scrolled ? "bg-card shadow-sm" : "bg-background",
          )}
        >
          <TableRow className="text-xs uppercase text-muted-foreground">
            <TableHead className="w-52">{t("screener.table.ticker")}</TableHead>
            <TableHead className="text-right">
              {t("screener.table.price")}
            </TableHead>
            <TableHead className="text-right">
              {t("screener.table.dividend_yield")}
            </TableHead>
            <TableHead className="text-right">
              {t("screener.table.p_l")}
            </TableHead>
            <TableHead className="text-right">
              {t("screener.table.p_vp")}
            </TableHead>
            <TableHead className="text-right">
              {t("screener.table.roe")}
            </TableHead>
            <TableHead className="text-right">
              {t("screener.table.net_margin")}
            </TableHead>
            <TableHead className="text-right">
              {t("screener.table.ev_ebitda")}
            </TableHead>
            <TableHead className="text-right">
              {t("screener.table.market_cap")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((q) => (
            <TableRow
              key={q.ticker}
              className="group cursor-pointer hover:bg-muted/50"
            >
              {/* Ticker + Name */}
              <TableCell>
                <Link
                  href={`/ativos/${q.ticker}`}
                  className="flex items-center gap-3 justify-between w-40"
                >
                  {q.logoUrl ? (
                    <Image
                      src={q.logoUrl}
                      alt={q.name}
                      width={28}
                      height={28}
                      className="rounded-md object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-[10px] font-bold">
                      {q.ticker.slice(0, 2)}
                    </span>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold leading-tight group-hover:text-secondary">
                      {q.ticker}
                    </p>
                    <p className="w-24 truncate text-xs text-muted-foreground">
                      {q.name}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="hidden text-[.5rem] lg:inline-flex uppercase"
                  >
                    {q.type === "fii"
                      ? t("screener.reit")
                      : t("screener.stock")}
                  </Badge>
                </Link>
              </TableCell>

              <TableCell className="text-right font-medium flex flex-col">
                <span className="font-semibold">{formatBRL(q.price)}</span>
                <ChangeCell value={q.change} />
              </TableCell>

              <TableCell className="text-right tabular-nums">
                {q.dividendYield != null ? (
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {formatPercent(q.dividendYield)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell className="text-right tabular-nums">
                {formatMultiple(q.pe)}
              </TableCell>

              <TableCell className="text-right tabular-nums">
                {formatMultiple(q.pb ?? q.pvp)}
              </TableCell>

              <TableCell className="text-right tabular-nums">
                {formatPercent(q.roe)}
              </TableCell>

              <TableCell className="text-right tabular-nums">
                {formatPercent(q.netMargin)}
              </TableCell>

              <TableCell className="text-right tabular-nums">
                {formatMultiple(q.evEbitda)}
              </TableCell>

              <TableCell className="text-right tabular-nums text-xs text-muted-foreground">
                {formatBillions(q.marketCap)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
