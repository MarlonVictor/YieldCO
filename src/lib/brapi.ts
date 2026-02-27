import type { Stock, Fii } from "@/types";

// ─── Configuração ─────────────────────────────────────────────────────────────

const BRAPI_BASE = "https://brapi.dev/api";

/** Token opcional — defina BRAPI_TOKEN no .env.local para limites maiores */
function buildUrl(path: string, params: Record<string, string> = {}): string {
  const url = new URL(`${BRAPI_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const token = process.env.BRAPI_TOKEN;
  if (token) url.searchParams.set("token", token);
  return url.toString();
}

// ─── Tipos brutos da brapi.dev ────────────────────────────────────────────────

interface BrapiQuoteResult {
  symbol: string;
  shortName: string | null;
  longName: string | null;
  sector: string | null;
  regularMarketPrice: number;
  priceEarnings: number | null; // P/L
  priceToBook: number | null; // P/VP
  returnOnEquity: number | null; // ROE  (decimal: 0.18 = 18 %)
  /** Não exposto diretamente pela brapi — reservado para extensão futura */
  returnOnAssets: number | null;
  earningsPerShare: number | null; // LPA
  bookValue: number | null; // VPA
  dividendYield: number | null; // DY   (decimal: 0.05 = 5 %)
  enterpriseToEbitda: number | null; // EV/EBITDA
  profitMargin: number | null; // Margem Líquida (decimal)
  /** Dívida Líquida / EBITDA — disponível em alguns retornos */
  debtToEquity: number | null;
}

interface BrapiQuoteResponse {
  results: BrapiQuoteResult[];
  error?: string;
}

interface BrapiFundResult {
  ticker: string;
  name: string | null;
  segment: string | null;
  regularMarketPrice: number;
  pvpa: number | null; // P/VP
  dividendYield: number | null; // DY 12m (decimal)
  physicalVacancy: number | null; // Vacância (percentual 0-100)
  liquidityAverage: number | null; // Liquidez diária média (R$)
}

interface BrapiFundsListResponse {
  funds: BrapiFundResult[];
  error?: string;
}

// ─── Mapeadores ───────────────────────────────────────────────────────────────

function toPercent(value: number | null): number | null {
  if (value === null || value === undefined) return null;
  // brapi retorna ROE/DY como decimal (0.15); convertemos para percentual (15)
  return parseFloat((value * 100).toFixed(2));
}

function mapQuoteToStock(r: BrapiQuoteResult): Stock {
  return {
    ticker: r.symbol,
    nome: r.longName ?? r.shortName ?? r.symbol,
    setor: r.sector ?? null,
    preco_atual: r.regularMarketPrice,
    pl: r.priceEarnings ?? null,
    pvp: r.priceToBook ?? null,
    evebitda: r.enterpriseToEbitda ?? null,
    roe: toPercent(r.returnOnEquity),
    roic: null, // não fornecido diretamente pela brapi
    margem_liquida: toPercent(r.profitMargin),
    divida_liquida_ebitda: r.debtToEquity ?? null,
    lpa: r.earningsPerShare ?? null,
    vpa: r.bookValue ?? null,
    // DPA estimado: DY × preço atual (aproximação quando DPA direto não existe)
    dpa:
      r.dividendYield != null
        ? parseFloat((r.dividendYield * r.regularMarketPrice).toFixed(2))
        : null,
    dy: toPercent(r.dividendYield),
  };
}

function mapFundToFii(f: BrapiFundResult): Fii {
  return {
    ticker: f.ticker,
    nome: f.name ?? f.ticker,
    segmento: f.segment ?? null,
    preco_atual: f.regularMarketPrice,
    pvp: f.pvpa ?? null,
    dy_12m: toPercent(f.dividendYield),
    vacancia: f.physicalVacancy ?? null,
    liquidez_diaria: f.liquidityAverage ?? null,
  };
}

// ─── Funções públicas ─────────────────────────────────────────────────────────

/**
 * Busca dados fundamentalistas de uma única ação pelo ticker.
 * @example fetchStock('WEGE3')
 */
export async function fetchStock(ticker: string): Promise<Stock> {
  const url = buildUrl(`/quote/${ticker.toUpperCase()}`, {
    fundamental: "true",
    modules:
      "summaryProfile,defaultKeyStatistics,financialData,incomeStatementHistory",
  });

  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) {
    throw new Error(`[brapi] fetchStock(${ticker}) falhou: HTTP ${res.status}`);
  }

  const data: BrapiQuoteResponse = await res.json();

  if (data.error) {
    throw new Error(`[brapi] fetchStock(${ticker}): ${data.error}`);
  }

  const result = data.results?.[0];
  if (!result) {
    throw new Error(
      `[brapi] fetchStock(${ticker}): nenhum resultado retornado`,
    );
  }

  return mapQuoteToStock(result);
}

/**
 * Retorna uma lista de ações com dados fundamentalistas.
 * Faz batch dos tickers do IBOVESPA em um único request.
 */
export async function fetchStockList(): Promise<Stock[]> {
  // Principais ações do IBOVESPA — amplie conforme necessário
  const TICKERS = [
    "PETR4",
    "VALE3",
    "ITUB4",
    "BBDC4",
    "BBAS3",
    "WEGE3",
    "RENT3",
    "LREN3",
    "JBSS3",
    "SUZB3",
    "RADL3",
    "TOTS3",
    "MGLU3",
    "VIIA3",
    "EGIE3",
    "TAEE11",
    "CPFE3",
    "ENBR3",
    "CPLE6",
    "CMIG4",
    "SBSP3",
    "SAPR11",
    "AMBP3",
    "KLBN11",
    "DXCO3",
    "BEEF3",
    "MRFG3",
    "BRFS3",
    "SMTO3",
    "MYPK3",
  ];

  const url = buildUrl(`/quote/${TICKERS.join(",")}`, {
    fundamental: "true",
  });

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      throw new Error(`[brapi] fetchStockList falhou: HTTP ${res.status}`);
    }

    const data: BrapiQuoteResponse = await res.json();

    if (data.error) {
      throw new Error(`[brapi] fetchStockList: ${data.error}`);
    }

    return (data.results ?? []).map(mapQuoteToStock);
  } catch (err) {
    console.error("[brapi] fetchStockList error:", err);
    return [];
  }
}

/**
 * Retorna a lista de FIIs com indicadores principais.
 */
export async function fetchFiiList(): Promise<Fii[]> {
  const url = buildUrl("/funds/list", { type: "FII", limit: "50" });

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      throw new Error(`[brapi] fetchFiiList falhou: HTTP ${res.status}`);
    }

    const data: BrapiFundsListResponse = await res.json();

    if (data.error) {
      throw new Error(`[brapi] fetchFiiList: ${data.error}`);
    }

    return (data.funds ?? []).map(mapFundToFii);
  } catch (err) {
    console.error("[brapi] fetchFiiList error:", err);
    return [];
  }
}
