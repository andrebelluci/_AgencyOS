/**
 * Demo data for dashboard metrics (dev tenant only).
 * Idempotent — skips if seed marker conversations already exist.
 *
 * Usage: npm run db:seed-demo
 */
import postgres from "postgres";

const DEV_TENANT_SLUG = "development";
const SEED_VISITOR_PREFIX = "seed-demo-visitor-";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required (.env.local)");
  }
  return url;
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(12, 0, 0, 0);
  return date;
}

async function main() {
  const sql = postgres(getDatabaseUrl(), { prepare: false, max: 1 });

  const [tenant] = await sql<{ id: string }[]>`
    SELECT id FROM tenants WHERE slug = ${DEV_TENANT_SLUG} LIMIT 1
  `;

  if (!tenant) {
    throw new Error(`Tenant "${DEV_TENANT_SLUG}" not found. Run npm run db:seed first.`);
  }

  const tenantId = tenant.id;

  const existing = await sql<{ count: number }[]>`
    SELECT count(*)::int AS count
    FROM conversations
    WHERE tenant_id = ${tenantId}
      AND visitor_id LIKE ${`${SEED_VISITOR_PREFIX}%`}
  `;

  if ((existing[0]?.count ?? 0) > 0) {
    console.log("Demo metrics data already exists — skipping.");
    await sql.end();
    return;
  }

  type LeadSeed = {
    name: string;
    phone: string;
    email: string;
    city: string;
    status: "novo" | "qualificado" | "proposta";
    createdAt: Date;
  };

  const leadSeeds: LeadSeed[] = [
    {
      name: "Ana Silva",
      phone: "5519988776655",
      email: "ana.silva@example.com",
      city: "Mogi Mirim",
      status: "qualificado",
      createdAt: daysAgo(1),
    },
    {
      name: "Bruno Costa",
      phone: "5519977665544",
      email: "bruno.costa@example.com",
      city: "Campinas",
      status: "novo",
      createdAt: daysAgo(2),
    },
    {
      name: "Carla Mendes",
      phone: "5519966554433",
      email: "carla.mendes@example.com",
      city: "Mogi Mirim",
      status: "proposta",
      createdAt: daysAgo(4),
    },
    {
      name: "Diego Alves",
      phone: "5519955443322",
      email: "diego.alves@example.com",
      city: "Itapira",
      status: "novo",
      createdAt: daysAgo(6),
    },
    {
      name: "Elisa Rocha",
      phone: "5519944332211",
      email: "elisa.rocha@example.com",
      city: "Mogi Mirim",
      status: "qualificado",
      createdAt: daysAgo(20),
    },
  ];

  const leadIds: string[] = [];

  for (const lead of leadSeeds) {
    const [row] = await sql<{ id: string }[]>`
      INSERT INTO leads (
        tenant_id, name, email, phone, city, source, status, created_at, updated_at
      )
      VALUES (
        ${tenantId},
        ${lead.name},
        ${lead.email},
        ${lead.phone},
        ${lead.city},
        ${"widget"},
        ${lead.status},
        ${lead.createdAt.toISOString()},
        ${lead.createdAt.toISOString()}
      )
      RETURNING id
    `;
    if (row) leadIds.push(row.id);
  }

  type ConversationSeed = {
    visitorId: string;
    leadIndex: number | null;
    daysAgoStarted: number;
    whatsappClick: boolean;
    messages: Array<{ role: "user" | "assistant"; content: string; offsetMinutes: number }>;
  };

  const conversationSeeds: ConversationSeed[] = [
    {
      visitorId: `${SEED_VISITOR_PREFIX}001`,
      leadIndex: 0,
      daysAgoStarted: 1,
      whatsappClick: true,
      messages: [
        { role: "user", content: "Quero orçamento de cimento queimado", offsetMinutes: 0 },
        { role: "assistant", content: "Posso ajudar! Qual a metragem aproximada?", offsetMinutes: 1 },
        { role: "user", content: "Uns 45m² na sala", offsetMinutes: 3 },
      ],
    },
    {
      visitorId: `${SEED_VISITOR_PREFIX}002`,
      leadIndex: 1,
      daysAgoStarted: 2,
      whatsappClick: true,
      messages: [
        { role: "user", content: "Vocês atendem Campinas?", offsetMinutes: 0 },
        { role: "assistant", content: "Sim! Me conta qual serviço você precisa.", offsetMinutes: 2 },
      ],
    },
    {
      visitorId: `${SEED_VISITOR_PREFIX}003`,
      leadIndex: 2,
      daysAgoStarted: 4,
      whatsappClick: false,
      messages: [
        { role: "user", content: "Preciso reformar o banheiro", offsetMinutes: 0 },
        { role: "assistant", content: "Trabalhamos com reformas completas. Qual prazo?", offsetMinutes: 1 },
        { role: "user", content: "Para daqui 2 meses", offsetMinutes: 4 },
        { role: "assistant", content: "Perfeito, vou registrar seu interesse.", offsetMinutes: 5 },
      ],
    },
    {
      visitorId: `${SEED_VISITOR_PREFIX}004`,
      leadIndex: 3,
      daysAgoStarted: 6,
      whatsappClick: false,
      messages: [
        { role: "user", content: "Bom dia!", offsetMinutes: 0 },
        { role: "assistant", content: "Olá! Como posso ajudar?", offsetMinutes: 1 },
      ],
    },
    {
      visitorId: `${SEED_VISITOR_PREFIX}005`,
      leadIndex: null,
      daysAgoStarted: 3,
      whatsappClick: false,
      messages: [
        { role: "user", content: "Qual horário de atendimento?", offsetMinutes: 0 },
        { role: "assistant", content: "Segunda a sexta, 8h às 18h.", offsetMinutes: 1 },
      ],
    },
    {
      visitorId: `${SEED_VISITOR_PREFIX}006`,
      leadIndex: null,
      daysAgoStarted: 5,
      whatsappClick: false,
      messages: [{ role: "user", content: "Só estou olhando, obrigado", offsetMinutes: 0 }],
    },
  ];

  for (const conv of conversationSeeds) {
    const startedAt = daysAgo(conv.daysAgoStarted);
    const leadId =
      conv.leadIndex !== null ? (leadIds[conv.leadIndex] ?? null) : null;
    const clickedAt = conv.whatsappClick
      ? new Date(startedAt.getTime() + 10 * 60 * 1000)
      : null;

    const metadata = clickedAt
      ? JSON.stringify({
          whatsapp_clicked_at: clickedAt.toISOString(),
          whatsapp_url: "https://wa.me/5519999999999",
        })
      : JSON.stringify({});

    const [conversation] = await sql<{ id: string }[]>`
      INSERT INTO conversations (
        tenant_id, lead_id, visitor_id, status, metadata, started_at, created_at, updated_at
      )
      VALUES (
        ${tenantId},
        ${leadId},
        ${conv.visitorId},
        ${"closed"},
        ${metadata}::jsonb,
        ${startedAt.toISOString()},
        ${startedAt.toISOString()},
        ${startedAt.toISOString()}
      )
      RETURNING id
    `;

    if (!conversation) continue;

    for (const message of conv.messages) {
      const createdAt = new Date(
        startedAt.getTime() + message.offsetMinutes * 60 * 1000,
      );

      await sql`
        INSERT INTO messages (
          tenant_id, conversation_id, role, content, created_at, updated_at
        )
        VALUES (
          ${tenantId},
          ${conversation.id},
          ${message.role},
          ${message.content},
          ${createdAt.toISOString()},
          ${createdAt.toISOString()}
        )
      `;
    }
  }

  console.log("Demo metrics seeded for tenant development:");
  console.log(`  Leads: ${leadIds.length}`);
  console.log(`  Conversations: ${conversationSeeds.length}`);
  console.log(
    `  WhatsApp clicks: ${conversationSeeds.filter((c) => c.whatsappClick).length}`,
  );
  console.log("Refresh /dashboard to see updated metrics.");

  await sql.end();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
