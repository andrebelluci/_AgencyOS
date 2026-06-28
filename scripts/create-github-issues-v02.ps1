# Script para criar issues V0.2 no GitHub
# Uso: powershell -File scripts/create-github-issues-v02.ps1

$milestone = "V0.2 - Site Conversacional"

$issues = @(
  @{
    t = "ISSUE-035: Dominio customizado por tenant"
    l = "v0.2,infra"
    b = @"
Campo ``custom_domain`` (ou ``domain``) em ``tenants``; middleware resolve tenant por domínio customizado antes do subdomínio (ver docs/MULTITENANCY.md).

**Aceite V0.2:**
- Owner/superadmin configura domínio no painel ou admin
- ``belluci.com.br`` resolve o tenant correto (widget + chat)
- Documentação DNS/CNAME em docs/DEPLOY.md
- RLS e isolamento mantidos

**Não inclui:** SSL automático, wildcard enterprise, múltiplos domínios por tenant.

**Depende de:** #31 (onboarding V0.1) mergeado.

Ref: docs/BACKLOG.md ISSUE-035 · docs/DEVELOPMENT_WAVES_V0.2.md Onda 2
"@
  },
  @{
    t = "ISSUE-036: Hero conversacional (estados pre-definidos)"
    l = "v0.2,widget,ai"
    b = @"
Chat inline na hero do site do cliente: onboarding conversacional com perguntas contextuais (serviço, cidade, prazo). Estados pré-definidos direcionam CTAs e conteúdo — **sem** LLM gerando layout/HTML.

**Aceite V0.2:**
- Snippet ou modo embed para hero inline documentado
- Fluxo de estados configurável por tenant (JSON em settings ou equivalente)
- Respostas persistem em conversation/messages como chat normal
- Lead capturado quando qualificado

**Não inclui:** Site Adaptativo completo (V0.3), geração de página por IA.

**Depende de:** ISSUE-045 recomendado antes (tema); #18 embed base.

Ref: docs/BACKLOG.md ISSUE-036 · docs/MVP.md secao Hero · docs/DEVELOPMENT_WAVES_V0.2.md Onda 2
"@
  },
  @{
    t = "ISSUE-037: iFrame embed alternativo"
    l = "v0.2,widget"
    b = @"
Alternativa ao launcher ``embed.js``: snippet iframe direto para embutir chat/hero em qualquer página (hero, sidebar, página dedicada).

**Aceite V0.2:**
- Gerador de snippet iframe em /settings (além do script atual)
- ``/chat?key=`` funciona dentro do iframe cross-origin
- Documentado em WIDGET_CUSTOMIZATION.md
- Parâmetros: key, theme (após #45), height/width

**Não inclui:** postMessage sync com tema do host; domínio customizado (ISSUE-035).

Ref: docs/BACKLOG.md ISSUE-037 · docs/DEV_PLAN.md D8 · docs/DEVELOPMENT_WAVES_V0.2.md Onda 2
"@
  },
  @{
    t = "ISSUE-038: Busca e filtro em conversas"
    l = "v0.2,panel"
    b = @"
Painel ``/conversations`` com busca textual e filtros (data, lead vinculado, período).

**Aceite V0.2:**
- Campo de busca filtra por conteúdo de mensagens ou metadados da conversa
- Filtro por intervalo de datas
- Performance aceitável com índice ou query otimizada por ``tenant_id``
- UI Shadcn consistente com /leads

**Não inclui:** busca semântica full-text avançada, export CSV.

Ref: docs/BACKLOG.md ISSUE-038 · docs/DEVELOPMENT_WAVES_V0.2.md Onda 1
"@
  },
  @{
    t = "ISSUE-039: RBAC owner + operator"
    l = "v0.2,panel,db"
    b = @"
Múltiplos usuários por tenant: roles ``owner`` e ``operator``. Operator acessa leads/conversas; owner mantém settings e knowledge.

**Aceite V0.2:**
- Coluna ``role`` em ``users`` (migration)
- Convite/criação de operator pelo owner (fluxo manual assistido OK)
- RLS + app layer: operator não edita settings críticos nem knowledge
- Login e sessão respeitam role

**Não inclui:** RBAC granular por recurso, billing por assento, self-service signup.

Ref: docs/BACKLOG.md ISSUE-039 · docs/DEV_PLAN.md D12 · docs/DEVELOPMENT_WAVES_V0.2.md Onda 3
"@
  },
  @{
    t = "ISSUE-040: tenant_features + planos basicos"
    l = "v0.2,db,panel"
    b = @"
Tabela ``tenant_features`` (tenant_id, feature, enabled) para feature flags por tenant/plano básico (Starter/Pro/Enterprise em PRODUCTS.md).

**Aceite V0.2:**
- Migration ``tenant_features`` com RLS
- Service ``isFeatureEnabled(tenantId, feature)``
- Superadmin ou settings gateiam features (ex.: hero, support_agent)
- Defaults sensatos para tenants existentes

**Não inclui:** billing enforced, checkout, Stripe.

Ref: docs/BACKLOG.md ISSUE-040 · docs/DATABASE.md tenant_features · docs/DEVELOPMENT_WAVES_V0.2.md Onda 3
"@
  },
  @{
    t = "ISSUE-041: Landing page Agency OS"
    l = "v0.2,panel,infra"
    b = @"
Landing pública de marketing do Agency OS (apex ``agencyos.com.br`` ou rota ``/`` do apex tenant): hero, benefícios, prova social, CTA, SEO básico.

**Aceite V0.2:**
- Página responsiva com Tailwind/Shadcn
- CTA para contato/demo/WhatsApp
- Meta tags e título SEO
- Deployável em produção sem quebrar widget dos clientes

**Não inclui:** blog, pricing dinâmico com checkout, CMS.

Ref: docs/BACKLOG.md ISSUE-041 · docs/ROADMAP.md Landing · docs/DEVELOPMENT_WAVES_V0.2.md Onda 3
"@
  },
  @{
    t = "ISSUE-042: Metricas conversao widget-lead-WhatsApp"
    l = "v0.2,panel"
    b = @"
Funil de conversão no painel: aberturas do widget (ou sessões chat) → mensagens → leads criados → cliques WhatsApp.

**Aceite V0.2:**
- Métricas visíveis no dashboard ou seção dedicada
- Contadores por tenant (últimos 7/30 dias)
- Clique WhatsApp já rastreado em V0.1 — integrar no funil
- Dados filtrados por ``tenant_id``

**Não inclui:** analytics avançado, Mixpanel, event store (V0.3).

Ref: docs/BACKLOG.md ISSUE-042 · docs/DEVELOPMENT_WAVES_V0.2.md Onda 1
"@
  },
  @{
    t = "ISSUE-043: Support Agent separado"
    l = "v0.2,ai"
    b = @"
Agente Support no runtime: Orchestrator roteia dúvidas de suporte/FAQ/garantia para Support Agent (não Sales).

**Aceite V0.2:**
- ``src/agents/support/`` com prompt e rules
- Tools: ``searchKnowledge`` (reuso), ``createTicket`` (stub ou registro mínimo)
- Orchestrator classifica intenção support vs sales
- Testes ``npm run test:agents`` atualizados

**Não inclui:** ticketing completo, SLA, email automático.

Ref: docs/BACKLOG.md ISSUE-043 · docs/AGENTS.md Support Agent · docs/DEVELOPMENT_WAVES_V0.2.md Onda 3
"@
  },
  @{
    t = "ISSUE-044: RAG citacao de fonte na resposta"
    l = "v0.2,ai,widget"
    bodyFile = "scripts/issue-044-body.txt"
  },
  @{
    t = "ISSUE-045: Widget dark mode (V0.2)"
    l = "v0.2,widget,panel"
    b = @"
Tema do chat no iframe (``/chat``) e painel do embed: ``light``, ``dark`` ou ``auto`` (``prefers-color-scheme``). Setting em ``tenant_settings`` + opcional ``data-theme`` no script embed.

**Aceite V0.2:**
- Site escuro + widget ``dark`` ou ``auto`` exibe chat coerente
- Contraste WCAG AA; ``primary_color`` continua como accent
- Editor em Settings; API ``/api/widget/config`` expõe theme
- Iframe **não** herda CSS do site hospedeiro

**Não inclui:** detecção do tema da página via postMessage; temas completos V0.3+.

Ref: docs/BACKLOG.md ISSUE-045 · docs/DEV_PLAN.md D18 · docs/DEVELOPMENT_WAVES_V0.2.md Onda 1 (primeira issue)
"@
  }
)

foreach ($i in $issues) {
  if ($i.bodyFile) {
    gh issue create --title $i.t --body-file $i.bodyFile --label $i.l --milestone $milestone
  } else {
    gh issue create --title $i.t --body $i.b --label $i.l --milestone $milestone
  }
  Start-Sleep -Milliseconds 600
}

Write-Host "Done. List issues:"
gh issue list --milestone $milestone --limit 20
