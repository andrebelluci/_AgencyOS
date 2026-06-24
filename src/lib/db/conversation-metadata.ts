export type ConversationMetadata = {
  whatsapp_clicked_at?: string;
  whatsapp_url?: string;
};

export function mergeConversationMetadata(
  current: ConversationMetadata | null | undefined,
  patch: ConversationMetadata,
): ConversationMetadata {
  return {
    ...(current ?? {}),
    ...patch,
  };
}
