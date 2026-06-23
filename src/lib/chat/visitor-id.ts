const VISITOR_ID_PREFIX = "agencyos_visitor_";

function createVisitorId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function getOrCreateVisitorId(publicKey: string): string {
  const storageKey = `${VISITOR_ID_PREFIX}${publicKey}`;

  try {
    const existing = localStorage.getItem(storageKey)?.trim();
    if (existing) {
      return existing;
    }

    const visitorId = createVisitorId();
    localStorage.setItem(storageKey, visitorId);
    return visitorId;
  } catch {
    return createVisitorId();
  }
}
