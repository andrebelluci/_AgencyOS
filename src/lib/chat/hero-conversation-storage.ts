const HERO_CONVERSATION_PREFIX = "agencyos_hero_conversation_";

export function getStoredHeroConversationId(publicKey: string): string | null {
  if (typeof sessionStorage === "undefined") {
    return null;
  }

  return sessionStorage.getItem(`${HERO_CONVERSATION_PREFIX}${publicKey}`);
}

export function storeHeroConversationId(
  publicKey: string,
  conversationId: string,
): void {
  if (typeof sessionStorage === "undefined") {
    return;
  }

  if (!conversationId) {
    sessionStorage.removeItem(`${HERO_CONVERSATION_PREFIX}${publicKey}`);
    return;
  }

  sessionStorage.setItem(
    `${HERO_CONVERSATION_PREFIX}${publicKey}`,
    conversationId,
  );
}
