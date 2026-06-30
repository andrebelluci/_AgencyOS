import type { HeroFlowAnswers } from "@/lib/widget/hero-flow";

export type HeroFlowConversationState = {
  mode: "hero";
  answers: HeroFlowAnswers;
  completed: boolean;
};

export type ConversationMetadata = {
  whatsapp_clicked_at?: string;
  whatsapp_url?: string;
  hero_flow?: HeroFlowConversationState;
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
