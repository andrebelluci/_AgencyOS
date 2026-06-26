export const QUICK_ACTION_TYPES = ["whatsapp", "link"] as const;

export type QuickActionType = (typeof QUICK_ACTION_TYPES)[number];

/** Stored in tenant_settings.quick_actions — migratable to a dedicated table later. */
export type QuickActionConfig = {
  label: string;
  type: QuickActionType;
  url?: string;
  enabled: boolean;
};

export type ResolvedQuickAction = {
  label: string;
  type: QuickActionType;
  url: string;
};
