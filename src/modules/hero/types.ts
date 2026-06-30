import type { HeroFlowRuntimeStep } from "@/lib/widget/hero-flow";

export type HeroChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type HeroChatStep = HeroFlowRuntimeStep | null;

export type HeroChatResult = {
  conversationId: string;
  messages: HeroChatMessage[];
  step: HeroChatStep;
  whatsappUrl: string | null;
  done: boolean;
};

export class HeroApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "HeroApiError";
  }
}
