export const WIDGET_THEMES = ["light", "dark", "auto"] as const;

export type WidgetTheme = (typeof WIDGET_THEMES)[number];

export const DEFAULT_WIDGET_THEME: WidgetTheme = "light";

export function parseWidgetTheme(
  value: string | null | undefined,
): WidgetTheme {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "dark" || normalized === "auto") {
    return normalized;
  }
  return DEFAULT_WIDGET_THEME;
}

export function parseWidgetThemeOverride(
  value: string | null | undefined,
): WidgetTheme | null {
  if (!value?.trim()) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (
    normalized === "light" ||
    normalized === "dark" ||
    normalized === "auto"
  ) {
    return normalized;
  }

  return null;
}

export function resolveEffectiveWidgetTheme(
  tenantTheme: string | null | undefined,
  override: WidgetTheme | null | undefined,
): WidgetTheme {
  if (override) {
    return override;
  }

  return parseWidgetTheme(tenantTheme);
}

export function isWidgetDarkMode(
  theme: WidgetTheme,
  prefersDark: boolean,
): boolean {
  if (theme === "dark") {
    return true;
  }
  if (theme === "light") {
    return false;
  }
  return prefersDark;
}
