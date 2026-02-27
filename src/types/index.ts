// ─── Ação (Stock) ────────────────────────────────────────────────────────────

export interface Stock {
  /** Código de negociação na B3 (ex.: PETR4, WEGE3) */
  ticker: string;
  /** Razão social / nome abreviado */
  nome: string;
  /** Setor econômico */
  setor: string | null;
  /** Preço atual de mercado */
  preco_atual: number;

  // ── Indicadores de valuation ────────────────────────────────────────────────
  /** Preço / Lucro */
  pl: number | null;
  /** Preço / Valor Patrimonial */
  pvp: number | null;
  /** EV / EBITDA */
  evebitda: number | null;

  // ── Indicadores de rentabilidade ────────────────────────────────────────────
  /** Return on Equity — percentual (ex.: 18.5 = 18,5%) */
  roe: number | null;
  /** Return on Invested Capital — percentual */
  roic: number | null;
  /** Margem Líquida — percentual */
  margem_liquida: number | null;

  // ── Endividamento ────────────────────────────────────────────────────────────
  /** Dívida Líquida / EBITDA */
  divida_liquida_ebitda: number | null;

  // ── Por ação ─────────────────────────────────────────────────────────────────
  /** Lucro Por Ação (LPA / EPS) */
  lpa: number | null;
  /** Valor Patrimonial Por Ação (VPA / BVPS) */
  vpa: number | null;
  /** Dividendo Por Ação — soma dos últimos 12 meses */
  dpa: number | null;
  /** Dividend Yield — percentual (ex.: 5.2 = 5,2%) */
  dy: number | null;
}

// ─── FII ─────────────────────────────────────────────────────────────────────

export interface Fii {
  /** Código de negociação na B3 (ex.: MXRF11, KNRI11) */
  ticker: string;
  /** Nome do fundo */
  nome: string;
  /** Segmento (Logística, Lajes Corporativas, Shoppings, etc.) */
  segmento: string | null;
  /** Preço atual de mercado */
  preco_atual: number;

  // ── Indicadores ──────────────────────────────────────────────────────────────
  /** Preço / Valor Patrimonial */
  pvp: number | null;
  /** Dividend Yield dos últimos 12 meses — percentual */
  dy_12m: number | null;
  /** Taxa de vacância física — percentual */
  vacancia: number | null;
  /** Liquidez diária média — em reais */
  liquidez_diaria: number | null;
}

// ─── Valuation ───────────────────────────────────────────────────────────────

export type Sinal = "compra" | "neutro" | "evitar";

export interface ValuationResult {
  /** Nome do método utilizado (ex.: "Graham", "Bazin") */
  metodo: string;
  /** Preço justo calculado pelo método */
  preco_justo: number;
  /** Margem de segurança em relação ao preço atual — percentual */
  margem_seguranca: number;
  /** Sinal de decisão */
  sinal: Sinal;
}

// ─── Score ────────────────────────────────────────────────────────────────────

export interface ScoreResult {
  /** Score consolidado de 0 a 100 */
  score: number;
  /** Detalhamento por método de valuation */
  detalhes: ValuationResult[];
}
