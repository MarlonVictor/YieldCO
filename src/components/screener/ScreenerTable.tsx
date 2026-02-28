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
import type { Quote } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface ScreenerTableProps {
  data: Quote[];
}

export function ScreenerTable({ data }: ScreenerTableProps) {
  const { t } = useLanguage();

  if (!data.length) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        {t("screener.no_assets_found")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="text-xs uppercase text-muted-foreground">
            <TableHead className="w-52">{t("screener.table.ticker")}</TableHead>
            <TableHead className="text-right">
              {t("screener.table.price")}
            </TableHead>
            <TableHead className="text-right">
              {t("screener.table.change")}
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
                  className="flex items-center gap-3"
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
                  <div>
                    <p className="font-semibold leading-tight group-hover:text-emerald-600">
                      {q.ticker}
                    </p>
                    <p className="max-w-[130px] truncate text-xs text-muted-foreground">
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

              <TableCell className="text-right font-mono font-medium">
                {formatBRL(q.price)}
              </TableCell>

              <TableCell className="text-right">
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
