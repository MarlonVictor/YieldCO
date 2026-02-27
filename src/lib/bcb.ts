/**
 * lib/bcb.ts
 * Busca indicadores macroeconômicos do Banco Central do Brasil (BCB / SGS).
 *
 * Série 4189 — CDI Over (% ao ano)
 * https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados/ultimos/1?formato=json
 */

interface BcbEntry {
  /** Data no formato DD/MM/AAAA */
  data: string;
  /** Valor da série como string para preservar precisão */
  valor: string;
}

/**
 * Retorna o CDI Over anualizado mais recente, em pontos percentuais.
 *
 * - Cache de 24 horas (`revalidate: 86400`) — a taxa muda no máximo
 *   uma vez por reunião do COPOM (~45 dias).
 * - Em caso de falha, lança um `Error` com mensagem descritiva.
 *
 * @returns CDI como número (ex.: 10.65 = 10,65 % a.a.)
 */
export async function fetchCdi(): Promise<number> {
  const url =
    "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4189/dados/ultimos/1?formato=json";

  const res = await fetch(url, { next: { revalidate: 86400 } });

  if (!res.ok) {
    throw new Error(`[bcb] fetchCdi falhou: HTTP ${res.status}`);
  }

  const data: BcbEntry[] = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("[bcb] fetchCdi: resposta vazia ou inesperada do BCB");
  }

  const valor = parseFloat(data[0].valor);

  if (Number.isNaN(valor)) {
    throw new Error(
      `[bcb] fetchCdi: não foi possível converter "${data[0].valor}" para número`,
    );
  }

  return valor;
}
