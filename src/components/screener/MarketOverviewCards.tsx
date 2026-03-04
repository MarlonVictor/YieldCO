import { getMarketOverview } from "@/lib/api/hgbrasil";
import { cn } from "@/utils/cn";
import type { HgCurrency, HgStock, HgTax } from "@/types";

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconDollar() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function IconBitcoin() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 5.6m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
    </svg>
  );
}

function IconChartBar() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

// function IconGlobe() {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       width="15"
//       height="15"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <circle cx="12" cy="12" r="10" />
//       <line x1="2" y1="12" x2="22" y2="12" />
//       <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
//     </svg>
//   );
// }

function IconPercent() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

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

// ─── Variation badge ──────────────────────────────────────────────────────────

function VariationBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
        positive
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
          : "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400",
      )}
    >
      {positive ? <ArrowUp /> : <ArrowDown />}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

// ─── Base card ────────────────────────────────────────────────────────────────

function Card({
  label,
  value,
  sub,
  variation,
  icon,
  accentColor,
}: {
  label: string;
  value: string;
  sub?: string;
  variation?: number;
  icon: React.ReactNode;
  accentColor?: "green" | "orange";
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between gap-3 overflow-hidden rounded-xl border border-border bg-card px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md",
        "bg-gradient-to-r from-card",
        accentColor === "green" &&
          "to-emerald-50/70 dark:to-card border-l-2 border-l-primary",
        accentColor === "orange" &&
          "to-orange-50/70 dark:to-card border-l-2 border-l-secondary",
        !accentColor && "to-card",
      )}
    >
      {/* top row: label + icon */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </span>
      </div>

      {/* main value */}
      <div className="flex flex-col gap-2">
        <span className="text-[1.2rem] font-bold tabular-nums leading-none tracking-tight">
          {value}
        </span>
        <div className="flex items-center gap-2">
          {variation != null && <VariationBadge value={variation} />}
          {sub && (
            <span
              className="truncate text-[11px] text-muted-foreground"
              title={sub}
            >
              {sub}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Formatters ──────────────────────────────────────────────────────────────

function fmtBRL(value: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function fmtUSD(value: number | null, decimals = 0): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function fmtPoints(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// ─── Typed cards ─────────────────────────────────────────────────────────────

function CurrencyCard({
  label,
  ticker,
  data,
}: {
  label: string;
  ticker: "USD" | "BTC";
  data: HgCurrency;
}) {
  const isBTC = ticker === "BTC";
  const buyFmt = isBTC ? fmtUSD(data.buy) : fmtBRL(data.buy);
  const sellFmt = isBTC ? fmtUSD(data.sell) : fmtBRL(data.sell);

  return (
    <Card
      label={label}
      value={buyFmt}
      sub={`Venda ${sellFmt}`}
      variation={data.variation}
      icon={isBTC ? <IconBitcoin /> : <IconDollar />}
      accentColor="orange"
    />
  );
}

function IndexCard({
  label,
  data,
  icon,
}: {
  label: string;
  data: HgStock;
  icon: React.ReactNode;
}) {
  return (
    <Card
      label={label}
      value={fmtPoints(data.points)}
      variation={data.variation}
      icon={icon}
      accentColor="green"
    />
  );
}

function TaxCard({ tax }: { tax: HgTax }) {
  return (
    <Card
      label="CDI / SELIC"
      value={`${tax.cdi.toFixed(2)}% a.a.`}
      sub={`SELIC ${tax.selic.toFixed(2)}% a.a.`}
      icon={<IconPercent />}
      accentColor="green"
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export async function MarketOverviewCards() {
  let overview: Awaited<ReturnType<typeof getMarketOverview>> | null = null;

  try {
    overview = await getMarketOverview();
  } catch {
    return null; // fail silently — main screener still renders
  }

  if (!overview) return null;

  const latestTax = overview.taxes[0] ?? null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <CurrencyCard label="Dólar" ticker="USD" data={overview.currencies.USD} />
      <CurrencyCard
        label="Bitcoin"
        ticker="BTC"
        data={overview.currencies.BTC}
      />
      <IndexCard
        label="Ibovespa"
        data={overview.stocks.IBOVESPA}
        icon={<IconChartBar />}
      />
      <IndexCard
        label="IFIX"
        data={overview.stocks.IFIX}
        icon={<IconBuilding />}
      />
      {/* <IndexCard
        label="Nasdaq"
        data={overview.stocks.NASDAQ}
        icon={<IconGlobe />}
      /> */}
      {latestTax && <TaxCard tax={latestTax} />}
    </div>
  );
}
