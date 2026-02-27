/**
 * lib/calculations.ts
 * Funções puras de valuation e scoring — sem dependências externas.
 *
 * Métodos implementados
 * ─────────────────────
 * Graham   → √(22,5 × LPA × VPA)
 * Bazin    → DPA / 0,06  (preço justo = DY de 6 % ao ano)
 * Score    → pontuação 0-100 com critérios múltiplos para ações e FIIs
 */

import type { Stock, Fii, ValuationResult, ScoreResult, Sinal } from "@/types";

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Taxa de retorno exigida por Bazin (6 % a.a.) */
const BAZIN_TAXA = 0.06;

/** Limiares para o sinal de decisão */
const SINAL_COMPRA_THRESHOLD = 30; // margem ≥ 30 %  → compra
const SINAL_EVITAR_THRESHOLD = 0; // margem <  0 %  → evitar

// ─── Utilitários internos ─────────────────────────────────────────────────────

function resolverSinal(margemSeguranca: number): Sinal {
  if (margemSeguranca >= SINAL_COMPRA_THRESHOLD) return "compra";
  if (margemSeguranca < SINAL_EVITAR_THRESHOLD) return "evitar";
  return "neutro";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ─── Cálculos de preço justo ──────────────────────────────────────────────────

/**
 * Fórmula de Graham: preço justo = √(22,5 × LPA × VPA)
 *
 * Retorna `null` quando os dados são insuficientes ou o argumento do
 * radical seria negativo (empresa com prejuízo e/ou VPA negativo).
 *
 * @param lpa - Lucro Por Ação (positivo para empresas lucrativas)
 * @param vpa - Valor Patrimonial Por Ação (positivo para PL positivo)
 */
export function calcGraham(
  lpa: number | null,
  vpa: number | null,
): number | null {
  if (lpa === null || vpa === null) return null;
  const argumento = 22.5 * lpa * vpa;
  if (argumento <= 0) return null;
  return parseFloat(Math.sqrt(argumento).toFixed(2));
}

/**
 * Fórmula de Bazin: preço justo = DPA / 6 %
 *
 * Retorna `null` quando DPA não está disponível ou é zero/negativo.
 *
 * @param dpa - Dividendo Por Ação (soma dos últimos 12 meses)
 */
export function calcBazin(dpa: number | null): number | null {
  if (dpa === null || dpa <= 0) return null;
  return parseFloat((dpa / BAZIN_TAXA).toFixed(2));
}

/**
 * Margem de segurança em percentual.
 *
 * Fórmula: ((preçoJusto - preçoAtual) / preçoJusto) × 100
 *
 * Um valor positivo indica desconto; negativo indica prêmio (ativo caro).
 *
 * @param precoJusto  - Preço justo calculado por algum método
 * @param precoAtual  - Preço de mercado atual
 */
export function calcMargemSeguranca(
  precoJusto: number,
  precoAtual: number,
): number {
  if (precoJusto === 0) return 0;
  return parseFloat(
    (((precoJusto - precoAtual) / precoJusto) * 100).toFixed(2),
  );
}

// ─── Score de Ações ───────────────────────────────────────────────────────────

/**
 * Pontuação fundamentalista de uma ação (0-100).
 *
 * Critérios e pesos
 * ─────────────────
 * P/L entre 5 e 15        → 15 pts
 * P/VP < 1,5              → 15 pts
 * ROE > 15 %              → 15 pts
 * ROIC > 15 %             → 10 pts
 * EV/EBITDA < 10          → 10 pts
 * Margem Líquida > 10 %   → 10 pts
 * Dívida/EBITDA < 3       →  10 pts
 * Graham — margem ≥ 30 %  → 15 pts  (sinal adicional de valuation)
 *                  Total  → 100 pts
 *
 * @param stock - Dados fundamentalistas da ação
 */
export function calcScoreAcao(stock: Stock): ScoreResult {
  const detalhes: ValuationResult[] = [];
  let pontos = 0;

  // ── Método Graham ──────────────────────────────────────────────────────────
  const precoGraham = calcGraham(stock.lpa, stock.vpa);
  if (precoGraham !== null) {
    const margem = calcMargemSeguranca(precoGraham, stock.preco_atual);
    const sinal = resolverSinal(margem);
    detalhes.push({
      metodo: "Graham",
      preco_justo: precoGraham,
      margem_seguranca: margem,
      sinal,
    });
    if (margem >= SINAL_COMPRA_THRESHOLD) pontos += 15;
    else if (margem >= 0) pontos += 7;
    // margem negativa → 0 pts
  }

  // ── Método Bazin ──────────────────────────────────────────────────────────
  const precoBazin = calcBazin(stock.dpa);
  if (precoBazin !== null) {
    const margem = calcMargemSeguranca(precoBazin, stock.preco_atual);
    const sinal = resolverSinal(margem);
    detalhes.push({
      metodo: "Bazin",
      preco_justo: precoBazin,
      margem_seguranca: margem,
      sinal,
    });
  }

  // ── Critérios quantitativos ────────────────────────────────────────────────

  // P/L
  if (stock.pl !== null) {
    if (stock.pl >= 5 && stock.pl <= 15) pontos += 15;
    else if (stock.pl > 15 && stock.pl <= 25) pontos += 7;
  }

  // P/VP
  if (stock.pvp !== null) {
    if (stock.pvp < 1) pontos += 15;
    else if (stock.pvp < 1.5) pontos += 10;
    else if (stock.pvp < 2.5) pontos += 5;
  }

  // ROE (em %)
  if (stock.roe !== null) {
    if (stock.roe > 20) pontos += 15;
    else if (stock.roe > 15) pontos += 12;
    else if (stock.roe > 10) pontos += 6;
  }

  // ROIC (em %)
  if (stock.roic !== null) {
    if (stock.roic > 20) pontos += 10;
    else if (stock.roic > 15) pontos += 7;
    else if (stock.roic > 10) pontos += 4;
  }

  // EV/EBITDA
  if (stock.evebitda !== null && stock.evebitda > 0) {
    if (stock.evebitda < 6) pontos += 10;
    else if (stock.evebitda < 10) pontos += 7;
    else if (stock.evebitda < 15) pontos += 3;
  }

  // Margem Líquida (em %)
  if (stock.margem_liquida !== null) {
    if (stock.margem_liquida > 20) pontos += 10;
    else if (stock.margem_liquida > 10) pontos += 7;
    else if (stock.margem_liquida > 5) pontos += 3;
  }

  // Dívida Líquida / EBITDA
  if (stock.divida_liquida_ebitda !== null) {
    if (stock.divida_liquida_ebitda < 1) pontos += 10;
    else if (stock.divida_liquida_ebitda < 2) pontos += 7;
    else if (stock.divida_liquida_ebitda < 3) pontos += 3;
  }

  const score = clamp(Math.round(pontos), 0, 100);
  return { score, detalhes };
}

// ─── Score de FIIs ────────────────────────────────────────────────────────────

/**
 * Pontuação de um FII em relação ao CDI (0-100).
 *
 * Critérios e pesos
 * ─────────────────
 * P/VP < 1,0                     → 25 pts
 * DY 12m > CDI + 2 pp            → 30 pts  (prêmio sobre o CDI)
 * Vacância < 5 %                 → 25 pts
 * Liquidez diária > R$ 1 mi      → 20 pts
 *                          Total → 100 pts
 *
 * @param fii - Dados do FII
 * @param cdi - CDI anualizado em percentual (ex.: 10.65)
 */
export function calcScoreFii(fii: Fii, cdi: number): ScoreResult {
  const detalhes: ValuationResult[] = [];
  let pontos = 0;

  // ── Valuation: P/VP como referência de preço justo ─────────────────────────
  if (fii.pvp !== null && fii.pvp > 0) {
    // Preço justo pelo VPA: preço_atual / P/VP = VPA
    const vpa = fii.preco_atual / fii.pvp;
    const margem = calcMargemSeguranca(vpa, fii.preco_atual);
    const sinal = resolverSinal(margem);
    detalhes.push({
      metodo: "P/VP",
      preco_justo: parseFloat(vpa.toFixed(2)),
      margem_seguranca: margem,
      sinal,
    });

    if (fii.pvp < 0.85) pontos += 25;
    else if (fii.pvp < 1.0) pontos += 18;
    else if (fii.pvp < 1.1) pontos += 8;
  }

  // ── Valuation: DY vs CDI ──────────────────────────────────────────────────
  if (fii.dy_12m !== null) {
    // Preço justo pelo DY = dividendo anual / taxa mínima aceitável (CDI + 2 pp)
    const taxaMinima = (cdi + 2) / 100;
    // Estimativa de dividendo anual: preco_atual × dy_12m / 100
    const dividendoAnual = fii.preco_atual * (fii.dy_12m / 100);
    const precoJustoDy =
      taxaMinima > 0
        ? parseFloat((dividendoAnual / taxaMinima).toFixed(2))
        : fii.preco_atual;

    const margem = calcMargemSeguranca(precoJustoDy, fii.preco_atual);
    const sinal = resolverSinal(margem);
    detalhes.push({
      metodo: "DY vs CDI",
      preco_justo: precoJustoDy,
      margem_seguranca: margem,
      sinal,
    });

    const premioSobreCdi = fii.dy_12m - cdi;
    if (premioSobreCdi >= 4) pontos += 30;
    else if (premioSobreCdi >= 2) pontos += 22;
    else if (premioSobreCdi >= 0) pontos += 10;
  }

  // ── Vacância ──────────────────────────────────────────────────────────────
  if (fii.vacancia !== null) {
    if (fii.vacancia < 3) pontos += 25;
    else if (fii.vacancia < 5) pontos += 18;
    else if (fii.vacancia < 10) pontos += 8;
  }

  // ── Liquidez diária ───────────────────────────────────────────────────────
  if (fii.liquidez_diaria !== null) {
    if (fii.liquidez_diaria >= 5_000_000) pontos += 20;
    else if (fii.liquidez_diaria >= 1_000_000) pontos += 14;
    else if (fii.liquidez_diaria >= 200_000) pontos += 6;
  }

  const score = clamp(Math.round(pontos), 0, 100);
  return { score, detalhes };
}
