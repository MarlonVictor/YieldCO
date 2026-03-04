/**
 * hgbrasil.com — free API for Brazilian market overview data.
 * Docs: https://hgbrasil.com/status/finance
 *
 * Provides currencies, stock indices and tax rates (CDI/SELIC).
 * Token is optional for limited requests; set HGBRASIL_TOKEN env to unlock
 * higher limits.
 */

import type { HgFinanceResponse, HgTax, MarketOverview } from "@/types";

const BASE = "https://api.hgbrasil.com";
const TOKEN = process.env.HGBRASIL_TOKEN ?? "";

function authParam() {
  return TOKEN ? `?key=${TOKEN}` : "?key=demo";
}

// ─── Fetch full market overview ───────────────────────────────────────────────

export async function getMarketOverview(): Promise<MarketOverview> {
  const url = `${BASE}/finance${authParam()}`;

  const res = await fetch(url, {
    next: { revalidate: 300 }, // 5-min cache – rates update frequently
  });

  if (!res.ok) throw new Error(`hgbrasil finance error: ${res.status}`);

  const data: HgFinanceResponse = await res.json();
  const { currencies, stocks, taxes } = data.results;

  return {
    currencies: {
      USD: currencies.USD,
      BTC: currencies.BTC,
    },
    stocks: {
      IBOVESPA: stocks.IBOVESPA,
      IFIX: stocks.IFIX,
      // NASDAQ: stocks.NASDAQ,
    },
    taxes,
  };
}

// ─── Currencies ───────────────────────────────────────────────────────────────

export async function getCurrencies() {
  const overview = await getMarketOverview();
  return overview.currencies;
}

// ─── Stock indices ────────────────────────────────────────────────────────────

export async function getIndices() {
  const overview = await getMarketOverview();
  return overview.stocks;
}

// ─── Tax rates (CDI / SELIC) ──────────────────────────────────────────────────

export async function getTaxes(): Promise<HgTax[]> {
  const overview = await getMarketOverview();
  return overview.taxes;
}

/** Returns the most recent tax entry, or null if unavailable. */
export async function getLatestTax(): Promise<HgTax | null> {
  const taxes = await getTaxes();
  return taxes.length > 0 ? taxes[0] : null;
}
