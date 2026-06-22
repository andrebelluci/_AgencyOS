import { NextResponse } from "next/server";
import postgres from "postgres";

import {
  createConversation,
  createMessage,
  deleteConversation,
  deleteMessage,
  getConversation,
  getMessage,
  listMessages,
  updateConversation,
  updateMessage,
} from "@/modules/conversations/service";
import {
  createLead,
  deleteLead,
  getLead,
  listLeads,
  updateLead,
} from "@/modules/leads/service";

export const dynamic = "force-dynamic";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required.");
  }
  return url;
}

async function ensureTestTenant(): Promise<string> {
  const sql = postgres(getDatabaseUrl(), { prepare: false, max: 1 });

  const existing = await sql<{ id: string }[]>`
    SELECT id FROM tenants WHERE slug = 'development' LIMIT 1
  `;

  if (existing[0]) {
    await sql.end();
    return existing[0].id;
  }

  const slug = `svc-test-${Date.now()}`;
  const [tenant] = await sql<{ id: string }[]>`
    INSERT INTO tenants (name, slug, public_key, status)
    VALUES (${"Service Test Tenant"}, ${slug}, ${`pk-${slug}`}, 'active')
    RETURNING id
  `;

  await sql.end();

  if (!tenant) {
    throw new Error("Failed to create test tenant.");
  }

  return tenant.id;
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    const tenantId = await ensureTestTenant();
    const checks: string[] = [];

    const lead = await createLead(tenantId, {
      name: "Maria Teste",
      email: "maria@test.local",
      phone: "19999990000",
      city: "Mogi Mirim",
      source: "widget",
      status: "novo",
    });

    const fetchedLead = await getLead(tenantId, lead.id);
    if (!fetchedLead || fetchedLead.name !== "Maria Teste") {
      throw new Error("getLead failed.");
    }
    checks.push("leads:get");

    const updatedLead = await updateLead(tenantId, lead.id, {
      status: "qualificado",
      score: "médio",
    });
    if (!updatedLead || updatedLead.status !== "qualificado") {
      throw new Error("updateLead failed.");
    }
    checks.push("leads:update");

    const leads = await listLeads(tenantId);
    if (!leads.some((row) => row.id === lead.id)) {
      throw new Error("listLeads failed.");
    }
    checks.push("leads:list");

    const conversation = await createConversation(tenantId, {
      visitorId: `visitor-${Date.now()}`,
      leadId: lead.id,
    });

    const fetchedConversation = await getConversation(tenantId, conversation.id);
    if (!fetchedConversation || fetchedConversation.leadId !== lead.id) {
      throw new Error("getConversation failed.");
    }
    checks.push("conversations:get");

    const closedConversation = await updateConversation(
      tenantId,
      conversation.id,
      { status: "closed", endedAt: new Date() },
    );
    if (!closedConversation || closedConversation.status !== "closed") {
      throw new Error("updateConversation failed.");
    }
    checks.push("conversations:update");

    const message = await createMessage(tenantId, {
      conversationId: conversation.id,
      role: "user",
      content: "Olá, quero um orçamento.",
    });

    const fetchedMessage = await getMessage(tenantId, message.id);
    if (
      !fetchedMessage ||
      fetchedMessage.content !== "Olá, quero um orçamento."
    ) {
      throw new Error("getMessage failed.");
    }
    checks.push("messages:get");

    const updatedMessage = await updateMessage(tenantId, message.id, {
      content: "Olá, quero um orçamento de cimento queimado.",
    });
    if (
      !updatedMessage ||
      updatedMessage.content !== "Olá, quero um orçamento de cimento queimado."
    ) {
      throw new Error("updateMessage failed.");
    }
    checks.push("messages:update");

    const messages = await listMessages(tenantId, conversation.id);
    if (messages.length !== 1) {
      throw new Error("listMessages failed.");
    }
    checks.push("messages:list");

    if (!(await deleteMessage(tenantId, message.id))) {
      throw new Error("deleteMessage failed.");
    }
    checks.push("messages:delete");

    if (!(await deleteConversation(tenantId, conversation.id))) {
      throw new Error("deleteConversation failed.");
    }
    checks.push("conversations:delete");

    if (!(await deleteLead(tenantId, lead.id))) {
      throw new Error("deleteLead failed.");
    }
    checks.push("leads:delete");

    return NextResponse.json({
      ok: true,
      issue: "ISSUE-008",
      checks,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
