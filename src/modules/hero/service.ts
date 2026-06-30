import "server-only";

import { randomUUID } from "node:crypto";

import { mergeConversationMetadata } from "@/lib/db/conversation-metadata";
import type { TenantSettings } from "@/lib/db";
import {
  getCurrentRuntimeStep,
  isHeroFlowComplete,
  resolveHeroFlowConfig,
  validateHeroAnswer,
  buildLeadNotesFromHeroAnswers,
  type HeroFlowAnswers,
  type HeroFlowConfig,
} from "@/lib/widget/hero-flow";
import {
  createConversation,
  createMessage,
  getConversation,
  listMessages,
  updateConversation,
} from "@/modules/conversations/service";
import { getLead } from "@/modules/leads/service";
import { getTenantSettings } from "@/modules/settings/service";
import { findTenantByPublicKey } from "@/modules/tenants/repository";
import { assertActiveTenantForApi } from "@/modules/tenants/assert-active";
import { createLead } from "@/tools/create-lead";
import { buildWhatsAppLink } from "@/tools/build-whatsapp-link";

import { HeroApiError, type HeroChatResult } from "./types";

export { HeroApiError } from "./types";

type HeroContext = {
  tenantId: string;
  conversationId: string;
  leadId: string | null;
  config: HeroFlowConfig;
  services: string[];
  whatsapp: string | null;
  answers: HeroFlowAnswers;
  completed: boolean;
};

function mapStoredMessages(
  rows: Awaited<ReturnType<typeof listMessages>>,
): HeroChatResult["messages"] {
  return rows
    .filter((row) => row.role === "user" || row.role === "assistant")
    .map((row) => ({
      id: row.id,
      role: row.role as "user" | "assistant",
      content: row.content,
    }));
}

function resolveWhatsAppUrl(
  whatsapp: string | null,
  leadName: string | undefined,
): string | null {
  if (!whatsapp?.trim()) {
    return null;
  }

  const link = buildWhatsAppLink({
    phone: whatsapp,
    leadName,
  });

  return link.ok ? link.url : null;
}

async function resolveOrCreateConversation(
  tenantId: string,
  conversationId: string | undefined,
  visitorId: string | undefined,
): Promise<{
  conversationId: string;
  leadId: string | null;
  answers: HeroFlowAnswers;
  completed: boolean;
}> {
  if (conversationId) {
    const conversation = await getConversation(tenantId, conversationId);
    if (!conversation) {
      throw new HeroApiError("Conversation not found.", 404);
    }

    const heroState = conversation.metadata?.hero_flow;

    return {
      conversationId: conversation.id,
      leadId: conversation.leadId,
      answers: heroState?.answers ?? {},
      completed: heroState?.completed ?? false,
    };
  }

  const conversation = await createConversation(tenantId, {
    visitorId: visitorId?.trim() || randomUUID(),
    metadata: {
      hero_flow: {
        mode: "hero",
        answers: {},
        completed: false,
      },
    },
  });

  return {
    conversationId: conversation.id,
    leadId: conversation.leadId,
    answers: {},
    completed: false,
  };
}

async function persistAssistantMessage(
  tenantId: string,
  conversationId: string,
  content: string,
): Promise<void> {
  await createMessage(tenantId, {
    conversationId,
    role: "assistant",
    content,
  });
}

async function persistUserMessage(
  tenantId: string,
  conversationId: string,
  content: string,
): Promise<void> {
  await createMessage(tenantId, {
    conversationId,
    role: "user",
    content,
  });
}

async function updateHeroState(
  tenantId: string,
  conversationId: string,
  answers: HeroFlowAnswers,
  completed: boolean,
  leadId?: string | null,
): Promise<void> {
  const conversation = await getConversation(tenantId, conversationId);
  if (!conversation) {
    return;
  }

  await updateConversation(tenantId, conversationId, {
    leadId: leadId ?? conversation.leadId,
    metadata: mergeConversationMetadata(conversation.metadata, {
      hero_flow: {
        mode: "hero",
        answers,
        completed,
      },
    }),
  });
}

async function finalizeLead(
  context: HeroContext,
): Promise<{ leadId: string; whatsappUrl: string | null }> {
  const { answers, tenantId, conversationId, whatsapp } = context;

  const leadResult = await createLead(tenantId, {
    name: answers.name,
    phone: answers.phone,
    city: answers.city,
    source: "hero",
    status: "qualificado",
    score: "médio",
    notes: buildLeadNotesFromHeroAnswers(answers),
  });

  if (!leadResult.ok) {
    throw new HeroApiError(leadResult.error, 400);
  }

  const leadId = leadResult.data.id;
  const whatsappUrl = resolveWhatsAppUrl(whatsapp, answers.name);

  await updateHeroState(tenantId, conversationId, answers, true, leadId);

  if (whatsappUrl) {
    const conversation = await getConversation(tenantId, conversationId);
    if (conversation) {
      await updateConversation(tenantId, conversationId, {
        metadata: mergeConversationMetadata(conversation.metadata, {
          whatsapp_url: whatsappUrl,
          hero_flow: {
            mode: "hero",
            answers,
            completed: true,
          },
        }),
      });
    }
  }

  return { leadId, whatsappUrl };
}

function buildResult(
  context: HeroContext,
  messages: HeroChatResult["messages"],
  whatsappUrl: string | null,
): HeroChatResult {
  const step = context.completed
    ? null
    : getCurrentRuntimeStep(context.config, context.answers, context.services);

  return {
    conversationId: context.conversationId,
    messages,
    step,
    whatsappUrl,
    done: context.completed,
  };
}

async function loadWhatsAppForLead(
  tenantId: string,
  leadId: string | null,
  whatsapp: string | null,
): Promise<string | null> {
  if (!leadId || !whatsapp?.trim()) {
    return null;
  }

  const lead = await getLead(tenantId, leadId);
  if (!lead) {
    return null;
  }

  return resolveWhatsAppUrl(whatsapp, lead.name?.trim() || undefined);
}

function getSettingsContext(settings: TenantSettings) {
  const config = resolveHeroFlowConfig(settings.heroFlow, settings.services);

  if (!config.enabled) {
    throw new HeroApiError("Hero flow is not enabled for this tenant.", 403);
  }

  return {
    config,
    services: settings.services,
    whatsapp: settings.whatsapp,
  };
}

export async function getHeroChatState(
  publicKey: string,
  conversationId: string,
): Promise<HeroChatResult> {
  const tenant = await findTenantByPublicKey(publicKey);
  const activeTenant = assertActiveTenantForApi(tenant, HeroApiError);

  const settings = await getTenantSettings(activeTenant.id);
  if (!settings) {
    throw new HeroApiError("Tenant settings not found.", 404);
  }

  const { config, services, whatsapp } = getSettingsContext(settings);

  const conversation = await getConversation(activeTenant.id, conversationId);
  if (!conversation) {
    throw new HeroApiError("Conversation not found.", 404);
  }

  const heroState = conversation.metadata?.hero_flow;
  const answers = heroState?.answers ?? {};
  const completed = heroState?.completed ?? false;
  const messages = mapStoredMessages(
    await listMessages(activeTenant.id, conversationId),
  );

  const whatsappUrl =
    conversation.metadata?.whatsapp_url ??
    (await loadWhatsAppForLead(activeTenant.id, conversation.leadId, whatsapp));

  const context: HeroContext = {
    tenantId: activeTenant.id,
    conversationId,
    leadId: conversation.leadId,
    config,
    services,
    whatsapp,
    answers,
    completed,
  };

  return buildResult(context, messages, whatsappUrl);
}

export async function processHeroChat(input: {
  publicKey: string;
  action: "start" | "answer";
  value?: string;
  conversationId?: string;
  visitorId?: string;
}): Promise<HeroChatResult> {
  const tenant = await findTenantByPublicKey(input.publicKey);
  const activeTenant = assertActiveTenantForApi(tenant, HeroApiError);

  const settings = await getTenantSettings(activeTenant.id);
  if (!settings) {
    throw new HeroApiError("Tenant settings not found.", 404);
  }

  const { config, services, whatsapp } = getSettingsContext(settings);

  const resolved = await resolveOrCreateConversation(
    activeTenant.id,
    input.conversationId,
    input.visitorId,
  );

  let { answers, completed } = resolved;
  const conversationId = resolved.conversationId;
  let leadId = resolved.leadId;
  let whatsappUrl: string | null = null;

  if (input.action === "start" && !input.conversationId) {
    const existingMessages = await listMessages(activeTenant.id, conversationId);

    if (existingMessages.length === 0) {
      await persistAssistantMessage(
        activeTenant.id,
        conversationId,
        config.welcomeMessage,
      );

      const firstStep = getCurrentRuntimeStep(config, answers, services);
      if (firstStep) {
        await persistAssistantMessage(
          activeTenant.id,
          conversationId,
          firstStep.question,
        );
      }
    }
  }

  if (input.action === "answer") {
    if (completed) {
      throw new HeroApiError("Hero flow already completed.", 400);
    }

    const currentStep = getCurrentRuntimeStep(config, answers, services);
    if (!currentStep) {
      throw new HeroApiError("No pending step in hero flow.", 400);
    }

    const value = input.value?.trim() ?? "";
    const validationError = validateHeroAnswer(currentStep.field, value);
    if (validationError) {
      throw new HeroApiError(validationError, 400);
    }

    if (
      currentStep.type === "choice" &&
      currentStep.options &&
      !currentStep.options.some((option) => option.value === value)
    ) {
      throw new HeroApiError("Selecione uma das opções disponíveis.", 400);
    }

    const displayValue =
      currentStep.type === "choice"
        ? (currentStep.options?.find((option) => option.value === value)
            ?.label ?? value)
        : value;

    await persistUserMessage(activeTenant.id, conversationId, displayValue);

    answers = {
      ...answers,
      [currentStep.field]: value,
    };

    if (isHeroFlowComplete(config, answers)) {
      await persistAssistantMessage(
        activeTenant.id,
        conversationId,
        config.completionMessage,
      );

      const finalized = await finalizeLead({
        tenantId: activeTenant.id,
        conversationId,
        leadId,
        config,
        services,
        whatsapp,
        answers,
        completed: true,
      });

      leadId = finalized.leadId;
      whatsappUrl = finalized.whatsappUrl;
      completed = true;
    } else {
      const nextStep = getCurrentRuntimeStep(config, answers, services);
      if (nextStep) {
        await persistAssistantMessage(
          activeTenant.id,
          conversationId,
          nextStep.question,
        );
      }

      await updateHeroState(activeTenant.id, conversationId, answers, false);
    }
  }

  const messages = mapStoredMessages(
    await listMessages(activeTenant.id, conversationId),
  );

  if (!whatsappUrl && completed) {
    whatsappUrl = await loadWhatsAppForLead(
      activeTenant.id,
      leadId,
      whatsapp,
    );
  }

  const context: HeroContext = {
    tenantId: activeTenant.id,
    conversationId,
    leadId,
    config,
    services,
    whatsapp,
    answers,
    completed,
  };

  return buildResult(context, messages, whatsappUrl);
}