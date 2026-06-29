import type { ConversationSearchFilters } from "@/modules/conversations/types";

const DATE_PARAM_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

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
  const from = params.from?.trim() ?? "";
  const to = params.to?.trim() ?? "";

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
