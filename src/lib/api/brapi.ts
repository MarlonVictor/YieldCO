/**
 * brapi.dev — free API for B3 quotes, history and dividends.
 * Docs: https://brapi.dev/docs
 *
 * All fetches use Next.js native cache / revalidate so there is NO database.
 * Token is optional for reasonable rate-limits; set BRAPI_TOKEN env to unlock higher limits.
 */

import type { BrapiQuoteResponse, BrapiResult, Quote } from "@/types";

const BASE = "https://brapi.dev/api";
const TOKEN = process.env.BRAPI_TOKEN ?? "";

function authParam() {
  return TOKEN ? `&token=${TOKEN}` : "";
}

// ─── Map brapi result → our Quote type ──────────────────────────────────────

function mapResult(r: BrapiResult): Quote {
  const sp = r.summaryProfile;
  const isFii = sp?.sectorKey === "fundos-imobiliarios";

  return {
    ticker: r.symbol,
    name: r.shortName || r.longName,
    longName: r.longName,
    type: isFii ? "fii" : "acao",
    sector: sp?.sector,
    segment: sp?.industry,
    logoUrl: r.logourl,
    summary: sp?.longBusinessSummary,
    website: sp?.website,

    price: r.regularMarketPrice,
    change: r.regularMarketChangePercent,
    dayRange: r.regularMarketDayRange,
    priceHigh52: r.fiftyTwoWeekHigh,
    priceLow52: r.fiftyTwoWeekLow,

    pe: r.priceEarnings ?? undefined,

    lastDividend: r.dividendsData?.cashDividends?.[0]?.rate,
    marketCap: r.marketCap,

    dailyLiquidity: r.regularMarketVolume,
  };
}

// ─── Single or batch quote ───────────────────────────────────────────────────
export async function getQuotes(ticker: string): Promise<Quote[]> {
  try {
    const url = `${BASE}/quote/${ticker}?modules=summaryProfile&fundamental=true${authParam()}`;

    const res = await fetch(url, {
      next: { revalidate: 600 }, // 10-min cache
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.warn(`⚠️  Ticker ${ticker} erro ${res.status}:`, errorData);
      return [];
    }

    const data: BrapiQuoteResponse = await res.json();
    const results = (data.results ?? []).map(mapResult);

    return results;
  } catch (error) {
    console.error(`❌ Erro ao buscar ${ticker}:`, error);
    return [];
  }
}

// ─── Helper para limitar paralelismo ─────────────────────────────────────────
async function batchPromises<T>(
  promises: Promise<T>[],
  limit: number = 5,
): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < promises.length; i += limit) {
    const batch = promises.slice(i, i + limit);
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
  }
  return results;
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
  const url = `${BASE}/quote/list?sortBy=market_cap_basic&sortOrder=desc${authParam()}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 }, // 1h cache – list changes rarely
  });

  if (!res.ok) throw new Error(`brapi list error: ${res.status}`);

  const data = await res.json();
  return data.stocks ?? [];
}

// ─── Screener: top tickers by market cap (dynamic) ───────────────────────────
const SCREENER_LIMIT_ACOES = 50;
// const SCREENER_LIMIT_FIIS = 20;

export async function getScreenerData(): Promise<Quote[]> {
  // Busca lista completa ordenada por market cap e filtra por tipo
  const all = await listTickers();

  const topAcoes = all
    .filter((t) => t.type === "stock")
    .slice(0, SCREENER_LIMIT_ACOES)
    .map((t) => t.stock);

  // const topFiis = all
  //   .filter((t) => t.type === "fund")
  //   .slice(0, SCREENER_LIMIT_FIIS)
  //   .map((t) => t.stock);

  // Limita a apenas 5 requisições em paralelo para evitar rate limit
  const acaoPromises = topAcoes.map((ticker) => getQuotes(ticker));
  // const fiiPromises = topFiis.map((ticker) => getQuotes(ticker));

  const acaoResults = await batchPromises(acaoPromises, 5);
  // const fiiResults = await batchPromises(fiiPromises, 5);

  return [...acaoResults.flat()];
}
