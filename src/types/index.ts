// ─── Asset Types ────────────────────────────────────────────────────────────

export type AssetType = "acao" | "fii";

export interface Quote {
  ticker: string;
  name: string;
  type: AssetType;
  sector?: string;
  segment?: string;
  logoUrl?: string;

  // Price
  price: number;
  change: number; // % change today
  priceHigh52: number;
  priceLow52: number;

  // Valuation – Ações
  pe?: number; // P/L
  pb?: number; // P/VP
  evEbitda?: number; // EV/EBITDA
  psr?: number; // P/Receita

  // Rentability
  roe?: number; // %
  roic?: number; // %
  dividendYield?: number; // %
  lastDividend?: number;

  // Debt
  debtToEquity?: number;
  netDebt?: number;

  // Size
  marketCap?: number;
  enterpriseValue?: number;
  bookValue?: number;

  // FII specifics
  pvp?: number;
  vacancy?: number; // %
  monthlyYield?: number;
  netWorth?: number;
  dailyLiquidity?: number;

  // Revenue growth
  revenueGrowth?: number; // % TTM
  earningsGrowth?: number;
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
  };
  defaultKeyStatistics?: {
    bookValue?: number;
    priceToBook?: number;
    enterpriseValue?: number;
    enterpriseToEbitda?: number;
    enterpriseToRevenue?: number;
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
