import type { ConversionPeriod } from "./types";

export function parseConversionPeriod(
  value: string | string[] | undefined,
): ConversionPeriod {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "30d" ? "30d" : "7d";
}

export function conversionPeriodLabel(period: ConversionPeriod): string {
  return period === "30d" ? "Últimos 30 dias" : "Últimos 7 dias";
}
