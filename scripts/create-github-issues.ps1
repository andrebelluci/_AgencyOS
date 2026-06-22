# Script para criar issues V0.1 no GitHub
# Uso: powershell -File scripts/create-github-issues.ps1

$issues = @(
  @{ t="ISSUE-001: Bootstrap Next.js"; l="v0.1,infra"; b="Criar app Next.js 15 App Router, TypeScript, Tailwind, Shadcn. Ver docs/DEV_PLAN.md Bloco 0." },
  @{ t="ISSUE-002: Configurar Supabase"; l="v0.1,infra"; b="Projeto Supabase Auth+Postgres+Storage. .env.example documentado." },
  @{ t="ISSUE-003: Drizzle ORM + migrations base"; l="v0.1,db"; b="Schema tenants, tenant_settings, users. Migration inicial." },
  @{ t="ISSUE-004: Tenant resolution middleware"; l="v0.1,infra"; b="Subdominio + public_key. Helper getTenant()." },
  @{ t="ISSUE-005: Auth Supabase + login"; l="v0.1,infra"; b="Login, callback, protecao dashboard." },
  @{ t="ISSUE-006: RLS Supabase"; l="v0.1,db"; b="Row Level Security por tenant_id em todas as tabelas." },
  @{ t="ISSUE-007: Schema leads, conversations, messages"; l="v0.1,db"; b="Migrations conforme docs/DATABASE.md secao MVP." },
  @{ t="ISSUE-008: Modulos repositories/services"; l="v0.1"; b="src/modules/leads e conversations. Toda query filtra tenant_id." },
  @{ t="ISSUE-009: tenant_settings CRUD"; l="v0.1,panel"; b="Formulario settings no painel." },
  @{ t="ISSUE-010: Seed tenant desenvolvimento"; l="v0.1,db"; b="npm run db:seed com tenant dev." },
  @{ t="ISSUE-011: Estrutura agents orchestrator + sales"; l="v0.1,ai"; b="agent.ts, prompt.ts, rules.ts, tools.ts, types.ts" },
  @{ t="ISSUE-012: Prompt builder 4 camadas"; l="v0.1,ai"; b="system + platform + tenant + agent" },
  @{ t="ISSUE-013: Tools desacopladas"; l="v0.1,ai"; b="createLead, updateLead, buildWhatsAppLink com Zod" },
  @{ t="ISSUE-014: OpenAI streaming"; l="v0.1,ai"; b="Client OpenAI + SSE + function calling" },
  @{ t="ISSUE-015: API POST /api/chat"; l="v0.1,ai"; b="Route Handler publico com CORS, persiste messages" },
  @{ t="ISSUE-016: UI Chat component"; l="v0.1,widget"; b="Client component streaming + historico" },
  @{ t="ISSUE-017: API GET /api/widget/config"; l="v0.1,widget"; b="Branding publico por public_key" },
  @{ t="ISSUE-018: embed.js"; l="v0.1,widget"; b="Script embed cross-origin" },
  @{ t="ISSUE-019: Botao WhatsApp no widget"; l="v0.1,widget"; b="wa.me com mensagem pre-preenchida" },
  @{ t="ISSUE-020: Schema knowledge_documents + chunks"; l="v0.1,db"; b="pgvector extension, embedding em chunks" },
  @{ t="ISSUE-021: FAQ texto"; l="v0.1,panel"; b="CRUD FAQ sem PDF" },
  @{ t="ISSUE-022: searchKnowledge tool"; l="v0.1,ai"; b="Busca semantica top-K por tenant" },
  @{ t="ISSUE-023: RAG integrado no Sales Agent"; l="v0.1,ai"; b="Nao inventar sem contexto" },
  @{ t="ISSUE-024: Upload PDF + pipeline embeddings"; l="v0.1,ai"; b="Storage -> chunk -> embed -> pgvector" },
  @{ t="ISSUE-025: Painel /knowledge"; l="v0.1,panel"; b="Gestao documentos e status" },
  @{ t="ISSUE-026: Dashboard"; l="v0.1,panel"; b="Contagens conversas e leads" },
  @{ t="ISSUE-027: Pagina /leads"; l="v0.1,panel"; b="Lista + status CRM editavel" },
  @{ t="ISSUE-028: Pagina /conversations"; l="v0.1,panel"; b="Historico completo" },
  @{ t="ISSUE-029: Settings + embed code generator"; l="v0.1,panel"; b="Snippet script copiavel" },
  @{ t="ISSUE-030: Deploy producao"; l="v0.1,infra"; b="Vercel + Supabase prod" },
  @{ t="ISSUE-031: Onboarding 1o cliente"; l="v0.1"; b="Validar fluxo completo em producao" }
)

foreach ($i in $issues) {
  gh issue create --title $i.t --body "$($i.b)`n`nRef: docs/BACKLOG.md" --label $i.l --milestone "V0.1 - Funcionario Digital"
  Start-Sleep -Milliseconds 500
}
