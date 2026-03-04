// ─── Formatters for BRL and financial numbers ────────────────────────────────

export function formatBRL(value: number | undefined | null): string {
  if (value == null || isNaN(value)) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function parseAndFormatBRL(value: string | undefined | null): string {
  if (!value) return "—";
  return formatBRL(parseFloat(value));
}

export function formatPercent(
  value: number | undefined | null,
  decimals = 2,
): string {
  if (value == null || isNaN(value)) return "—";
  return `${value.toFixed(decimals)}%`;
}

export function formatMultiple(
  value: number | undefined | null,
  decimals = 2,
): string {
  if (value == null || isNaN(value)) return "—";
  return `${value.toFixed(decimals)}`;
}

export function formatBillions(value: number | undefined | null): string {
  if (value == null || isNaN(value)) return "—";
  if (Math.abs(value) >= 1_000_000_000) {
    return `R$ ${(value / 1_000_000_000).toFixed(2)} B`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(2)} M`;
  }
  return formatBRL(value);
}

export function formatChange(value: number | undefined | null): string {
  if (value == null || isNaN(value)) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
