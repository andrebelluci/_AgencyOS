# Onboarding do 1º cliente — Agency OS (ISSUE-031)

Checklist operacional para colocar o **primeiro cliente real** em produção usando **Platform Admin** (`/admin`) e **Provisioning** (`npm run provision:tenant`).

> Escopo V0.1: fluxo **manual assistido** pelo operador da plataforma. Sem self-service, billing ou domínio customizado obrigatório no primeiro go-live.

---

## Pré-requisitos

Antes de iniciar, confirme que estão mergeados em `main` e operacionais em produção:

| Issue | GitHub | Entrega |
|-------|--------|---------|
| Deploy produção | [#30](https://github.com/andrebelluci/_AgencyOS/issues/30) | Vercel + Supabase prod — ver [DEPLOY.md](./DEPLOY.md) |
| Platform Admin | [#37](https://github.com/andrebelluci/_AgencyOS/issues/37) | `/admin`, criar tenant, toggle ativo/inativo |
| Tenant Provisioning | [#39](https://github.com/andrebelluci/_AgencyOS/issues/39) | `provisionTenant()` + CLI — ver [PROVISIONING.md](./PROVISIONING.md) |

**Refinamentos recomendados (031A–031D):** mensagem inicial, ações rápidas, Sales Agent RAG-first, `primary_color` — ver [WIDGET_CUSTOMIZATION.md](./WIDGET_CUSTOMIZATION.md).

### Matriz de ambientes

| Ambiente | URL típica | Banco |
|----------|------------|-------|
| Local | `http://localhost:3000` | Supabase **dev** (`.env.local`) |
| Produção | `https://<projeto>.vercel.app` ou `https://app.agencyos.com.br` | Supabase **prod** (`.env` / Vercel Production) |

**Regra:** nunca rode `db:seed` de desenvolvimento nem `provision:tenant` com credenciais de dev contra o banco de produção por engano. Compare o **project ref** do Supabase antes de provisionar.

Checklist de isolamento: [DEPLOY.md § Matriz de ambientes](./DEPLOY.md#matriz-de-ambientes-obrigatório-antes-do-31).

---

## Papéis

| Papel | Quem | Acesso |
|-------|------|--------|
| **Operador plataforma** | Time Agency OS | E-mail em `PLATFORM_ADMIN_EMAILS` → `/admin` |
| **Owner do cliente** | Dono da empresa | `https://{slug}.agencyos.com.br/login` (ou apex em `*.vercel.app` até DNS wildcard) |
| **Visitante** | Lead no site | Widget `embed.js` ou `/chat?key=…` |

---

## Fase 0 — Smoke de produção

Execute na URL de produção (`NEXT_PUBLIC_APP_URL`):

- [ ] **0.1** `GET /api/health` → `200`, `"database": { "ok": true }`
- [ ] **0.2** Migrações aplicadas no Supabase prod (`npm run db:migrate` com `DATABASE_URL` prod)
- [ ] **0.3** `PLATFORM_ADMIN_EMAILS` configurado na Vercel Production
- [ ] **0.4** `OPENAI_API_KEY` com crédito (chat + embeddings)

**Comando (PowerShell):**

```powershell
Invoke-WebRequest -Uri "https://<sua-url-prod>/api/health" -UseBasicParsing | Select-Object StatusCode, Content
```

---

## Fase 1 — Criar tenant

Escolha **um** dos caminhos abaixo.

### Opção A — Platform Admin (recomendado em produção)

1. Acesse `https://<app-url>/login` com e-mail listado em `PLATFORM_ADMIN_EMAILS`.
2. Navegue para **`/admin`** → **Novo tenant** (`/admin/tenants/new`).
3. Preencha:
   - Nome da empresa
   - Slug (opcional — derivado do nome se vazio)
   - Nome do owner (opcional)
   - E-mail e senha do owner (mín. 8 caracteres)
4. Clique **Criar tenant**.
5. Anote na tela de sucesso: **`slug`**, **`public_key`**, e-mail do owner.

**Validação:**

- [ ] **1.A.1** Tenant aparece em `/admin/tenants` com status **active**
- [ ] **1.A.2** Owner comum (não listado em `PLATFORM_ADMIN_EMAILS`) recebe **403** em `/admin`

### Opção B — CLI `provision:tenant`

Use quando preferir terminal ou automação. Aponte `.env` para **produção** (`DATABASE_URL`, Supabase keys prod).

**PowerShell (Windows — flags via env):**

```powershell
$env:PROVISION_COMPANY="Nome do Cliente"
$env:PROVISION_EMAIL="owner@cliente.com.br"
$env:PROVISION_PASSWORD="SenhaSegura2026!"
$env:PROVISION_NAME="Nome do Owner"
# Opcional: $env:PROVISION_SLUG="cliente-slug"
npx tsx --env-file=.env scripts/provision-tenant.ts
```

**Linux/macOS:**

```bash
npm run provision:tenant -- \
  --company "Nome do Cliente" \
  --email owner@cliente.com.br \
  --password "SenhaSegura2026!" \
  --name "Nome do Owner"
```

**Validação:**

- [ ] **1.B.1** Saída imprime `tenant_id`, `slug`, `public_key`
- [ ] **1.B.2** Reexecutar com mesmo slug + mesmo owner é idempotente (não altera `public_key`)

Detalhes: [PROVISIONING.md](./PROVISIONING.md).

### Entrega ao cliente

- [ ] **1.C.1** Enviar credenciais do owner por canal seguro (não e-mail em texto plano se possível)
- [ ] **1.C.2** Informar URL do painel:
  - Com DNS wildcard: `https://{slug}.agencyos.com.br/dashboard`
  - Sem DNS (smoke em Vercel): `https://<app-url>/dashboard` com `PLATFORM_APEX_TENANT_SLUG={slug}`

---

## Fase 2 — Owner configura o tenant

Login como owner → painel do tenant.

### 2.1 Configurações (`/settings`)

- [ ] **2.1.1** Nome da empresa, WhatsApp (DDI+DDD+número), cidade
- [ ] **2.1.2** Serviços (um por linha) — usados pelo Sales Agent
- [ ] **2.1.3** Mensagem inicial com `{{company_name}}` (031A)
- [ ] **2.1.4** Cor primária do widget `primary_color` (031D)
- [ ] **2.1.5** Ações rápidas — WhatsApp e/ou link externo (031B)
- [ ] **2.1.6** Salvar → mensagem "Configurações salvas com sucesso"

### 2.2 Base de conhecimento (`/knowledge`)

- [ ] **2.2.1** Cadastrar ao menos **1 FAQ** (pergunta + resposta) sobre serviços ou garantias
- [ ] **2.2.2** (Opcional) Upload de PDF com catálogo ou políticas
- [ ] **2.2.3** Aguardar indexação (embeddings) — resposta do chat deve citar conteúdo do FAQ (031C)

### 2.3 Código embed (`/settings` — card "Instalar no site")

- [ ] **2.3.1** Copiar snippet `<script src="…/widget/embed.js" data-key="pk_…">`
- [ ] **2.3.2** Colar antes de `</body>` no site do cliente
- [ ] **2.3.3** Validar `GET /api/widget/config?key={public_key}` → `200` JSON com `company_name`, `primary_color`, `initial_message`

---

## Fase 3 — Validar widget e chat

### 3.1 Teste direto (sem iframe)

O MCP Browser do Cursor **não acessa iframes** — use `/chat` para QA:

```
https://<app-url>/chat?key={public_key}
```

- [ ] **3.1.1** Cabeçalho exibe nome da empresa
- [ ] **3.1.2** Mensagem inicial configurada aparece na abertura
- [ ] **3.1.3** Enviar mensagem → resposta do assistente (sem erro 500)
- [ ] **3.1.4** Ações rápidas visíveis (se habilitadas em Settings)

### 3.2 Teste no site do cliente

- [ ] **3.2.1** Botão flutuante aparece (canto inferior direito)
- [ ] **3.2.2** Abrir painel do chat funciona em mobile e desktop
- [ ] **3.2.3** Cor do launcher segue `primary_color`

### 3.3 Captura de lead (critério de aceite #31)

Conduza conversa de qualificação até o Sales Agent chamar `createLead`:

1. Visitante informa **nome** e **telefone** (e cidade/serviço se solicitado).
2. Assistente confirma registro.
3. Verificar lead no painel owner → **`/leads`**.

**Validação SQL (operador, banco prod):**

```sql
SELECT l.id, l.name, l.phone, l.status, l.created_at, t.slug
FROM leads l
JOIN tenants t ON t.id = l.tenant_id
ORDER BY l.created_at DESC
LIMIT 5;
```

- [ ] **3.3.1** Lead com nome e telefone corretos
- [ ] **3.3.2** `tenant_id` corresponde ao slug do cliente
- [ ] **3.3.3** Métricas em `/admin` incrementam "Leads (7 dias)" (após login platform admin)

Fluxos smoke completos: [QA_PLAN.md](./QA_PLAN.md) (F1–F6).

---

## Fase 4 — Go-live e operação

- [ ] **4.1** DNS `*.agencyos.com.br` apontando para Vercel (quando disponível) — [DEPLOY.md § Domínio](./DEPLOY.md#3-domínio-customizado-agencyoscombr-go-live)
- [ ] **4.2** Atualizar `NEXT_PUBLIC_APP_URL` para URL canônica
- [ ] **4.3** Owner treinado: Settings, Knowledge, Leads, embed
- [ ] **4.4** Documentar `public_key` e slug no CRM interno da agência

| Tarefa recorrente | Como |
|-------------------|------|
| Novo cliente | `/admin/tenants/new` ou `provision:tenant` |
| Desativar cliente | `/admin/tenants` → toggle inactive (widget/chat retornam 403) |
| Migração schema | `npm run db:migrate` contra prod |
| Logs | Vercel → Deployments → Functions |

---

## Troubleshooting

| Sintoma | Causa provável | Ação |
|---------|----------------|------|
| `403` em `/admin` | E-mail fora de `PLATFORM_ADMIN_EMAILS` | Adicionar e-mail na Vercel + redeploy |
| `Tenant not found` | Slug inexistente ou DNS | Conferir tenant em `/admin/tenants`; em `*.vercel.app` usar `PLATFORM_APEX_TENANT_SLUG` |
| Chat não responde | `OPENAI_API_KEY` ou rate limit | Logs Vercel; testar `/api/health` |
| Lead não aparece | Agente não chamou `createLead` | Pedir nome + telefone explicitamente; conferir `/leads` e logs |
| FAQ ignorado | Sem embedding / FAQ vazio | Recadastrar FAQ; aguardar indexação |
| `database.ok: false` | `DATABASE_URL` IPv6 na Vercel | Pooler IPv4 — [DEPLOY.md § Troubleshooting](./DEPLOY.md#databaseok-false-com-enotfound-dbrefsupabaseco) |

---

## Evidência de execução (QA ISSUE-031)

> Execução em **2026-06-27** contra produção. Ambiente validado pelo Dev Agent + QA Agent.

| Item | Resultado | Evidência |
|------|-----------|-----------|
| Health prod | ✅ `200` | `GET https://agency-os-seven-sigma.vercel.app/api/health` → `database.ok: true` |
| Tenant provisionado | ✅ | `dharmalabs` — criado `2026-06-26`, status `active` |
| Widget config API | ✅ `200` | `GET /api/widget/config?key=pk_…` → `company_name: Dharma Labs` |
| Chat em produção | ✅ | `/chat?key=pk_…` — mensagens enviadas e resposta do Sales Agent |
| **Lead real em prod** | ✅ | `João QA ISSUE-031`, tel. `5511999887766`, id `b536470e-8794-478c-ba89-aa1aec4dd0c5`, `2026-06-27T12:37:36Z` |
| `/admin` protegido | ✅ | Redireciona para `/login?next=/admin` sem sessão |
| `npm run build` | ✅ | CI local na branch `docs/issue-031-onboarding` |
| `npm run lint` | ✅ | Sem erros |

**Notas:**

- DNS `*.agencyos.com.br` ainda não resolvendo neste ambiente — smoke usou URL Vercel + `PLATFORM_APEX_TENANT_SLUG=dharmalabs`.
- Tenant criado via script `setup-first-client-prod.ts` (equivalente a `provision:tenant`); fluxo `/admin/tenants/new` documentado e disponível em produção.
- Lead de QA pode ser removido do painel `/leads` após validação.

---

## Gate V0.2

Com este checklist ✅ e **1º cliente pagante**, a Onda 7 está fechada e issues **#35+** (V0.2 produto) podem ser priorizadas. Ver [DEV_PLAN.md](./DEV_PLAN.md) e [BACKLOG.md](./BACKLOG.md).

---

## Referências

- [DEPLOY.md](./DEPLOY.md) — deploy e matriz de ambientes
- [PROVISIONING.md](./PROVISIONING.md) — CLI e idempotência
- [WIDGET_CUSTOMIZATION.md](./WIDGET_CUSTOMIZATION.md) — 031A–031D
- [QA_PLAN.md](./QA_PLAN.md) — F1–F6
- [MULTITENANCY.md](./MULTITENANCY.md) — subdomínio e `public_key`
