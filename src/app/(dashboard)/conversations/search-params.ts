import type { ConversationSearchFilters } from "@/modules/conversations/types";

const DATE_PARAM_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function getTodayDateInputValue(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function clampDateInputValue(value: string): string {
  const trimmed = value.trim();
  if (!DATE_PARAM_PATTERN.test(trimmed)) {
    return "";
  }

  const today = getTodayDateInputValue();
  return trimmed > today ? today : trimmed;
}

export type ConversationsPageSearchParams = {
  q?: string;
  from?: string;
  to?: string;
};

export function parseConversationsSearchParams(
  params: ConversationsPageSearchParams,
): {
  filters: ConversationSearchFilters;
  ui: { q: string; from: string; to: string };
} {
  const q = params.q?.trim() ?? "";
  const from = clampDateInputValue(params.from ?? "");
  const to = clampDateInputValue(params.to ?? "");

  const filters: ConversationSearchFilters = {};

  if (q) {
    filters.query = q;
  }

  if (DATE_PARAM_PATTERN.test(from)) {
    filters.startedFrom = new Date(`${from}T00:00:00.000-03:00`);
  }

  if (DATE_PARAM_PATTERN.test(to)) {
    filters.startedTo = new Date(`${to}T23:59:59.999-03:00`);
  }

  return {
    filters,
    ui: { q, from, to },
  };
}

export function hasActiveConversationFilters(
  filters: ConversationSearchFilters,
): boolean {
  return Boolean(
    filters.query?.trim() || filters.startedFrom || filters.startedTo,
  );
}
