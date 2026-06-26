const HEX_COLOR_PATTERN = /^#([0-9A-Fa-f]{6})$/;

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR_PATTERN.test(value.trim());
}

export function normalizeHexColor(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

  if (!isValidHexColor(withHash)) {
    return null;
  }

  return withHash.toLowerCase();
}
