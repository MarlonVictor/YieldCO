import { getMarketOverview } from "@/lib/api/hgbrasil";
import { HgCurrency, HgStock } from "@/types";
import { cn } from "@/utils/cn";
import { formatBRL, formatPoints, formatUSD } from "@/utils/format";
import {
  Bitcoin,
  Building,
  ChartColumn,
  DollarSign,
  Percent,
} from "lucide-react";

// ─── Variation badge ──────────────────────────────────────────────────────────
function ArrowUp() {
  return (
    <svg viewBox="0 0 10 10" width="9" height="9" fill="currentColor">
      <path d="M5 1 L9 7 L1 7 Z" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg viewBox="0 0 10 10" width="9" height="9" fill="currentColor">
      <path d="M5 9 L9 3 L1 3 Z" />
    </svg>
  );
}

function VariationBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 text-[11px] font-semibold tabular-nums -ml-2",
        positive
          ? "text-emerald-700 dark:text-emerald-400"
          : "text-red-600 dark:text-red-400",
      )}
    >
      {positive ? <ArrowUp /> : <ArrowDown />}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

// ─── Summary card ───────────────────────────────────────────────────────────
function SummaryCard({
  icon,
  title,
  buyData,
  pointsData,
  latestTax,
  format,
}: {
  icon: React.ReactNode;
  title: string;
  buyData?: HgCurrency;
  pointsData?: HgStock;
  latestTax?: number;
  format?: (value: number | null) => string;
}) {
  const value = buyData
    ? buyData.buy
    : pointsData
      ? pointsData.points
      : latestTax
        ? `${latestTax.toFixed(2)}% a.a.`
        : "N/A";

  const variation = buyData
    ? buyData.variation
    : pointsData
      ? pointsData.variation
      : null;

  return (
    <li className="inline-flex items-center gap-2 px-4">
      <span className="size-5 rounded-md bg-secondary text-white flex items-center justify-center">
        {icon}
      </span>
      <strong className="text-sm whitespace-nowrap">{title}: </strong>
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {format ? format(value as number | null) : value}
      </span>
      {variation !== null && <VariationBadge value={variation} />}
    </li>
  );
}

export default async function MarketOverviewSummary() {
  let overview: Awaited<ReturnType<typeof getMarketOverview>> | null = null;

  try {
    overview = await getMarketOverview();
  } catch {
    return null; // fail silently — main screener still renders
  }

  if (!overview) return null;

  const latestTax = overview.taxes[0] ?? null;

  return (
    <ul className="mt-14 w-full h-8 flex items-center justify-between bg-muted dark:bg-transparent dark:border-b border-border overflow-y-hidden overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <SummaryCard
        icon={<DollarSign className="h-3 w-3" />}
        title="Dólar"
        buyData={overview.currencies.USD}
        format={formatBRL}
      />
      <SummaryCard
        icon={<Bitcoin className="h-3 w-3" />}
        title="Bitcoin"
        buyData={overview.currencies.BTC}
        format={formatUSD}
      />
      <SummaryCard
        icon={<ChartColumn className="h-3 w-3" />}
        title="Ibovespa"
        pointsData={overview.stocks.IBOVESPA}
        format={formatPoints}
      />
      <SummaryCard
        icon={<Building className="h-3 w-3" />}
        title="IFIX"
        pointsData={overview.stocks.IFIX}
        format={formatPoints}
      />
      {latestTax && (
        <SummaryCard
          icon={<Percent className="h-3 w-3" />}
          title="CDI / SELIC"
          latestTax={latestTax.cdi}
        />
      )}
    </ul>
  );
}
