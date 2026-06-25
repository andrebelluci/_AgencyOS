const CONVERSATION_ID_PREFIX = "agencyos_conversation_";

export function getStoredConversationId(publicKey: string): string | null {
  try {
    return sessionStorage.getItem(`${CONVERSATION_ID_PREFIX}${publicKey}`);
  } catch {
    return null;
  }
}

export function storeConversationId(
  publicKey: string,
  conversationId: string,
): void {
  try {
    const key = `${CONVERSATION_ID_PREFIX}${publicKey}`;

    if (!conversationId) {
      sessionStorage.removeItem(key);
      return;
    }

    sessionStorage.setItem(key, conversationId);
  } catch {
    // sessionStorage unavailable — conversation continues in-memory only
  }
}
