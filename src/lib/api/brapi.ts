/**
 * brapi.dev — free API for B3 quotes, history and dividends.
 * Docs: https://brapi.dev/docs
 *
 * All fetches use Next.js native cache / revalidate so there is NO database.
 * Token is optional for reasonable rate-limits; set BRAPI_TOKEN env to unlock higher limits.
 */

import type {
  AssetDetail,
  BrapiQuoteResponse,
  BrapiResult,
  DividendPoint,
  HistoricalPoint,
  Quote,
} from "@/types";

const BASE = "https://brapi.dev/api";
const TOKEN = process.env.BRAPI_TOKEN ?? "";

function authParam() {
  return TOKEN ? `&token=${TOKEN}` : "";
}

// ─── Map brapi result → our Quote type ──────────────────────────────────────

function mapResult(r: BrapiResult): Quote {
  const isFii = /^[A-Z]{4}11$/.test(r.symbol);

  const ks = r.defaultKeyStatistics;
  const fd = r.financialData;
  const sp = r.summaryProfile;

  const dividendYield =
    fd?.dividendYield != null
      ? fd.dividendYield * 100
      : ks?.priceToBook != null && r.regularMarketPrice
        ? undefined
        : undefined;

  console.log({ r });

  return {
    ticker: r.symbol,
    name: r.shortName || r.longName,
    type: isFii ? "fii" : "acao",
    sector: sp?.sector,
    segment: sp?.industry,
    logoUrl: r.logourl,

    price: r.regularMarketPrice,
    change: r.regularMarketChangePercent,
    priceHigh52: r.fiftyTwoWeekHigh,
    priceLow52: r.fiftyTwoWeekLow,

    pe: r.priceEarnings ?? undefined,
    pb: ks?.priceToBook ?? undefined,
    evEbitda: ks?.enterpriseToEbitda ?? undefined,
    psr: ks?.enterpriseToRevenue ?? undefined,

    roe: fd?.returnOnEquity != null ? fd.returnOnEquity * 100 : undefined,
    roic: undefined,
    dividendYield,
    lastDividend: r.dividendsData?.cashDividends?.[0]?.rate,

    debtToEquity: fd?.debtToEquity ?? undefined,
    netDebt: undefined,

    marketCap: r.marketCap,
    enterpriseValue: ks?.enterpriseValue ?? undefined,
    bookValue: ks?.bookValue ?? undefined,

    revenueGrowth:
      ks?.revenueGrowth != null ? ks.revenueGrowth * 100 : undefined,
    earningsGrowth:
      ks?.earningsGrowth != null ? ks.earningsGrowth * 100 : undefined,

    // FII
    pvp: isFii ? ks?.priceToBook : undefined,
    dailyLiquidity: r.regularMarketVolume,
  };
}

// ─── Single or batch quote ───────────────────────────────────────────────────

export async function getQuotes(tickers: string[]): Promise<Quote[]> {
  const symbols = tickers.join(",");
  const modules = [
    "summaryProfile",
    "defaultKeyStatistics",
    "financialData",
  ].join(",");

  const url = `${BASE}/quote/${symbols}?modules=${modules}&fundamental=true${authParam()}`;

  const res = await fetch(url, {
    next: { revalidate: 600 }, // 10-min cache
  });

  if (!res.ok) throw new Error(`brapi quote error: ${res.status}`);

  const data: BrapiQuoteResponse = await res.json();
  return (data.results ?? []).map(mapResult);
}

// ─── List available tickers ──────────────────────────────────────────────────

export interface TickerItem {
  stock: string;
  name: string;
  close: number;
  change: number;
  volume: number;
  market_cap: number | null;
  logo: string;
  sector: string | null;
  type: "stock" | "fund" | "bdr";
}

export async function listTickers(): Promise<TickerItem[]> {
  const url = `${BASE}/quote/list?sortBy=market_cap&sortOrder=desc${authParam()}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 }, // 1h cache – list changes rarely
  });

  if (!res.ok) throw new Error(`brapi list error: ${res.status}`);

  const data = await res.json();
  return data.stocks ?? [];
}

// ─── Detail with history + dividends ─────────────────────────────────────────

export async function getAssetDetail(ticker: string): Promise<AssetDetail> {
  const modules = [
    "summaryProfile",
    "defaultKeyStatistics",
    "financialData",
    "historicalDataPrice",
    "dividendsData",
  ].join(",");

  const url = `${BASE}/quote/${ticker}?modules=${modules}&fundamental=true&range=1y&interval=1d${authParam()}`;

  const res = await fetch(url, {
    next: { revalidate: 600 },
  });

  if (!res.ok) throw new Error(`brapi detail error: ${res.status}`);

  const data: BrapiQuoteResponse = await res.json();
  const r = data.results?.[0];
  if (!r) throw new Error(`Ticker ${ticker} not found`);

  const quote = mapResult(r);

  const history: HistoricalPoint[] = (r.historicalDataPrice ?? []).map((p) => ({
    date: new Date(p.date * 1000).toISOString().split("T")[0],
    open: p.open,
    high: p.high,
    low: p.low,
    close: p.close,
    volume: p.volume,
  }));

  const dividends: DividendPoint[] = (r.dividendsData?.cashDividends ?? []).map(
    (d) => ({
      date: d.paymentDate,
      value: d.rate,
    }),
  );

  return {
    ...quote,
    history,
    dividends,
    description: r.summaryProfile?.longBusinessSummary,
    website: r.summaryProfile?.website,
    employees: r.summaryProfile?.fullTimeEmployees,
  };
}

// ─── Screener: top tickers by market cap ─────────────────────────────────────

const TOP_ACOES = [
  "PETR4",
  "VALE3",
  "ITUB4",
  "BBDC4",
  "ABEV3",
  "WEGE3",
  "RENT3",
  "BRFS3",
  "SUZB3",
  "LREN3",
  "MGLU3",
  "VBBR3",
  "GGBR4",
  "CSNA3",
  "USIM5",
  "CSAN3",
  "BEEF3",
  "JBSS3",
  "MRFG3",
  "PRIO3",
  "ENEV3",
  "EGIE3",
  "CPFE3",
  "CMIG4",
  "EMBR3",
  "RADL3",
  "RDOR3",
  "HAPV3",
  "BBAS3",
  "SANB11",
  "ITSA4",
  "BPAC11",
];

const TOP_FIIS = [
  "MXRF11",
  "HGLG11",
  "XPML11",
  "XPLG11",
  "VISC11",
  "IRDM11",
  "BTLG11",
  "RBRF11",
  "KNRI11",
  "BCFF11",
  "RBRP11",
  "HGRU11",
  "ALZR11",
  "TRXF11",
  "PVBI11",
  "CPTS11",
  "VGIP11",
  "KNCR11",
  "HCTR11",
  "MCCI11",
];

export async function getScreenerData(): Promise<Quote[]> {
  const tickers = [...TOP_ACOES, ...TOP_FIIS];

  // brapi supports up to ~20 tickers per request in free tier
  const chunks: string[][] = [];
  for (let i = 0; i < tickers.length; i += 20) {
    chunks.push(tickers.slice(i, i + 20));
  }

  const results = await Promise.all(chunks.map((chunk) => getQuotes(chunk)));
  return results.flat();
}
