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
import { ChangeCell } from "./ChangeCell";
import {
  formatBRL,
  formatBillions,
  formatMultiple,
  parseAndFormatBRL,
} from "@/utils/format";
import { useRef, useState } from "react";
import type { Quote } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/utils/cn";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ScreenerTableProps {
  data: Quote[];
  isReit?: boolean;
}

export function ScreenerTable({ data, isReit }: ScreenerTableProps) {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  function handleScroll() {
    setScrolled((scrollRef.current?.scrollTop ?? 0) > 0);
  }

  if (!data.length) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        {t("stocks.no_assets_found")}
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
            <TableHead className="w-52">{t("stocks.table.ticker")}</TableHead>
            {!isReit && <TableHead>{t("stocks.table.sector")}</TableHead>}
            <TableHead className="text-right">
              {t("stocks.table.price")}
            </TableHead>
            <TableHead className="text-right">
              {t("stocks.table.range")}
            </TableHead>
            {!isReit && (
              <>
                <TableHead className="text-right">
                  {t("stocks.table.p_e")}
                </TableHead>
                <TableHead className="text-right">
                  {t("stocks.table.market_cap")}
                </TableHead>
              </>
            )}
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
                  className="flex items-center gap-3 w-40"
                >
                  {q.logoUrl ? (
                    <Image
                      src={q.logoUrl}
                      alt={q.name}
                      width={28}
                      height={28}
                      className="rounded-md object-contain bg-card"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-[.625rem] font-bold">
                      {q.ticker.slice(0, 2)}
                    </span>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold leading-tight group-hover:text-secondary">
                      {q.ticker}
                    </p>
                    <p
                      className="w-32 truncate text-xs text-muted-foreground"
                      title={q.longName}
                    >
                      {q.longName}
                    </p>
                  </div>
                </Link>
              </TableCell>

              {!isReit && (
                <TableCell className="text-xs text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{q.sector ?? "—"}</span>
                      </TooltipTrigger>
                      {q.segment && (
                        <TooltipContent>
                          <p className="max-w-xs text-xs">{q.segment}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              )}

              <TableCell className="text-right font-medium flex flex-col">
                <span className="font-semibold">{formatBRL(q.price)}</span>
                <ChangeCell value={q.change} />
              </TableCell>

              <TableCell className="text-right">
                <p className="font-semibold">
                  {parseAndFormatBRL(q.dayRange.split(" - ").at(0))} -{" "}
                  {parseAndFormatBRL(q.dayRange.split(" - ").at(1))}
                </p>
                <p className="font-thin text-xs tabular-nums text-muted-foreground">
                  {formatBRL(q.priceLow52)} - {formatBRL(q.priceHigh52)}
                </p>
              </TableCell>

              {!isReit && (
                <>
                  <TableCell className="text-right tabular-nums">
                    {formatMultiple(q.pe)}
                  </TableCell>

                  <TableCell className="text-right tabular-nums text-xs text-muted-foreground">
                    {formatBillions(q.marketCap)}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
