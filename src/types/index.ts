// ─── Asset Types ────────────────────────────────────────────────────────────

export type AssetType = "acao" | "fii";

export interface Quote {
  ticker: string;
  name: string;
  longName?: string;
  type: AssetType;
  sector?: string;
  segment?: string;
  logoUrl?: string;
  summary?: string;
  website?: string;

  price: number;
  change: number; // % change today
  dayRange: string; // "min - max" do dia
  priceHigh52: number;
  priceLow52: number;

  pe?: number; // P/L
  lastDividend?: number;

  marketCap?: number;
  dailyLiquidity?: number;
}

export interface HistoricalPoint {
  date: string; // "YYYY-MM-DD"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface DividendPoint {
  date: string;
  value: number;
}

export interface AssetDetail extends Quote {
  history: HistoricalPoint[];
  dividends: DividendPoint[];
  description?: string;
  website?: string;
  employees?: number;
  cnpj?: string;
}

// ─── Screener Filters ────────────────────────────────────────────────────────

export interface ScreenerFilters {
  type: AssetType | "all";
  sector?: string;
  search: string;
  pe?: { min?: number; max?: number };
  pb?: { min?: number; max?: number };
  dy?: { min?: number; max?: number };
  roe?: { min?: number; max?: number };
}

export type SortField = keyof Quote;
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface BrapiQuoteResponse {
  results: BrapiResult[];
  requestedAt: string;
  took: string;
}

export interface BrapiResult {
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayRange: string;
  regularMarketPreviousClose: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  marketCap: number;
  logourl: string;
  priceEarnings?: number;
  earningsPerShare?: number;
  dividendsData?: {
    cashDividends?: Array<{
      assetIssued: string;
      paymentDate: string;
      rate: number;
      relatedTo: string;
      approvedOn: string;
      isinCode: string;
      label: string;
      lastDatePrior: string;
      remarks: string;
    }>;
  };
  summaryProfile?: {
    sector?: string;
    industry?: string;
    longBusinessSummary?: string;
    website?: string;
    fullTimeEmployees?: number;
    sectorKey?: string;
  };
  defaultKeyStatistics?: {
    bookValue?: number;
    priceToBook?: number;
    enterpriseValue?: number;
    enterpriseToEbitda?: number;
    enterpriseToRevenue?: number;
    profitMargins?: number;
    trailingEps?: number;
    earningsGrowth?: number;
    revenueGrowth?: number;
    returnOnEquity?: number;
    returnOnAssets?: number;
  };
  financialData?: {
    totalDebt?: number;
    totalStockholderEquity?: number;
    netIncome?: number;
    totalRevenue?: number;
    grossProfits?: number;
    ebitda?: number;
    freeCashflow?: number;
    debtToEquity?: number;
    returnOnEquity?: number;
    returnOnAssets?: number;
    dividendYield?: number;
    profitMargins?: number;
    revenueGrowth?: number;
    earningsGrowth?: number;
    grossMargins?: number;
    ebitdaMargins?: number;
    operatingMargins?: number;
    lastSplitFactor?: string;
  };
  historicalDataPrice?: Array<{
    date: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    adjustedClose: number;
  }>;
}

// ─── HG Brasil API ───────────────────────────────────────────────────────────

export interface HgCurrency {
  name: string;
  buy: number | null;
  sell: number | null;
  variation: number;
}

export interface HgStock {
  name: string;
  location: string | null;
  points: number;
  variation: number;
  used_time?: string;
}

export interface HgTax {
  date: string;
  cdi: number;
  selic: number;
  daily_factor: number;
  daily_factor_selic: number;
}

export interface HgFinanceResponse {
  by: string;
  valid_key: boolean;
  results: {
    currencies: {
      source: string;
      USD: HgCurrency;
      BTC: HgCurrency;
      [key: string]: HgCurrency | string;
    };
    stocks: {
      IBOVESPA: HgStock;
      IFIX: HgStock;
      NASDAQ: HgStock;
      [key: string]: HgStock;
    };
    taxes: HgTax[];
  };
  execution_time: number;
  from_cache: boolean;
}

export interface MarketOverview {
  currencies: {
    USD: HgCurrency;
    BTC: HgCurrency;
  };
  stocks: {
    IBOVESPA: HgStock;
    IFIX: HgStock;
    // NASDAQ: HgStock;
  };
  taxes: HgTax[];
}
