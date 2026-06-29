# Operações — Agency OS

Runbook do **operador da plataforma** para o dia a dia em produção.

> Escopo V0.1: fluxos **manual assistido**. Sem self-service de senha, billing ou exclusão de tenant pela UI.

---

## Papéis e acessos

| Papel | Quem | Onde acessa |
|-------|------|-------------|
| **Operador plataforma** | Time Agency OS | `/admin`, Vercel, Supabase prod |
| **Owner do cliente** | Dono da empresa | `https://{slug}.agencyos.com.br/login` |
| **Visitante** | Lead no site | Widget `embed.js` ou `/chat?key=…` |

O operador precisa ter o e-mail listado em `PLATFORM_ADMIN_EMAILS` (env na Vercel Production).

---

## Como acessar produção

### App (Platform Admin)

1. Abra a URL de produção (`NEXT_PUBLIC_APP_URL`), ex.: `https://agency-os-seven-sigma.vercel.app`.
2. Faça login em `/login` com e-mail em `PLATFORM_ADMIN_EMAILS`.
3. Acesse **`/admin`** — visão cross-tenant, métricas e gestão de tenants.

Sem sessão, `/admin` redireciona para `/login?next=/admin`.

### Vercel

1. [vercel.com](https://vercel.com) → projeto `_AgencyOS`.
2. **Deployments** — histórico, rollback, logs de build.
3. **Logs** (Runtime Logs) — requisições e stdout das Functions.
4. **Settings → Environment Variables** — credenciais de prod (`DATABASE_URL`, Supabase, `OPENAI_API_KEY`, etc.).

### Supabase (prod)

1. [supabase.com/dashboard](https://supabase.com/dashboard) → projeto de **produção** (project ref diferente do dev).
2. **Table Editor** — inspecionar `tenants`, `leads`, `users`.
3. **Authentication → Users** — reset manual de senha, exclusão de usuário Auth.
4. **SQL Editor** — queries operacionais (somente quando necessário).

### Smoke rápido

```powershell
Invoke-WebRequest -Uri "https://<sua-url-prod>/api/health" -UseBasicParsing | Select-Object StatusCode, Content
```

Esperado: `200` com `"database": { "ok": true }`.

### Regra de ouro

> **Nunca** rode `db:seed`, `provision:tenant` ou migrações apontando credenciais de **dev** contra o banco de **prod**.

Confira o project ref em `NEXT_PUBLIC_SUPABASE_URL` antes de qualquer operação destrutiva. Matriz completa: [DEPLOY.md § Matriz de ambientes](./DEPLOY.md#matriz-de-ambientes-obrigatório-antes-do-31).

---

## Como criar cliente

Escolha **um** dos caminhos.

### Opção A — Platform Admin (recomendado)

1. Login como operador → **`/admin`** → **Novo tenant** (`/admin/tenants/new`).
2. Preencha:
   - Nome da empresa
   - Slug (opcional — derivado do nome se vazio)
   - Nome do owner (opcional)
   - E-mail e senha do owner (mín. 8 caracteres)
3. Clique **Criar tenant**.
4. Anote na tela de sucesso: **`slug`**, **`public_key`**, e-mail do owner.

**Validação:**

- Tenant aparece em `/admin/tenants` com status **Ativo**.
- Owner comum (fora de `PLATFORM_ADMIN_EMAILS`) recebe **403** em `/admin`.

### Opção B — CLI `provision:tenant`

Aponte `.env` para **produção** (`DATABASE_URL`, chaves Supabase prod).

**PowerShell (Windows):**

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

### O que é criado

| Recurso | Detalhe |
|---------|---------|
| `tenants` | `name`, `slug`, `public_key`, `status = active` |
| `tenant_settings` | Defaults (mensagem inicial, cor, serviços vazios) |
| Supabase Auth | Usuário owner com e-mail confirmado |
| `users` | Row `role = owner` vinculada ao tenant |

### Entrega ao cliente

- [ ] Enviar credenciais por canal seguro (WhatsApp, reunião — evitar e-mail em texto plano).
- [ ] Informar URL do painel:
  - Com DNS wildcard: `https://{slug}.agencyos.com.br/dashboard`
  - Sem DNS (smoke em Vercel): `https://<app-url>/dashboard` com `PLATFORM_APEX_TENANT_SLUG={slug}`
- [ ] Anotar `public_key` para o embed do widget.

Detalhes de idempotência e flags: [PROVISIONING.md](./PROVISIONING.md).

---

## Como resetar senha

V0.1 **não** possui fluxo “Esqueci minha senha” no app. O operador reseta manualmente.

### Opção A — Reexecutar provisioning (mesmo slug + mesmo e-mail)

Idempotente: atualiza a senha no Supabase Auth **sem** alterar `public_key`.

```powershell
$env:PROVISION_COMPANY="Nome do Cliente"
$env:PROVISION_EMAIL="owner@cliente.com.br"   # mesmo e-mail do owner atual
$env:PROVISION_PASSWORD="NovaSenhaSegura2026!"
$env:PROVISION_SLUG="cliente-slug"            # slug existente
npx tsx --env-file=.env scripts/provision-tenant.ts
```

> **Atenção:** se o e-mail for **diferente** do owner atual, o comando retorna `OWNER_CONFLICT`. Use [Como trocar owner](#como-trocar-owner).

### Opção B — Supabase Dashboard

1. Supabase prod → **Authentication → Users**.
2. Localize o e-mail do owner.
3. **Send password recovery** (envia e-mail) **ou** defina nova senha manualmente na UI.

### Opção C — Admin API (script)

Padrão usado em `scripts/set-shared-admin-password.ts`:

```typescript
await supabase.auth.admin.updateUserById(authUserId, {
  password: "NovaSenhaSegura2026!",
});
```

Requer `SUPABASE_SERVICE_ROLE_KEY`. Obtenha o `authUserId` em **Authentication → Users** ou:

```sql
SELECT u.id, u.email, t.slug
FROM users u
JOIN tenants t ON t.id = u.tenant_id
WHERE t.slug = 'cliente-slug' AND u.role = 'owner';
```

---

## Como suspender tenant

Suspender = status **`inactive`**. O tenant continua no banco, mas perde acesso público.

### Pelo Platform Admin

1. `/admin/tenants`
2. Localize o tenant → clique **Desativar**
3. Status muda para **Inativo**

### Efeito imediato

| Superfície | Comportamento |
|------------|---------------|
| Widget `/api/widget/config` | **403** — `Tenant is inactive` |
| Chat `/api/chat` | **403** |
| Painel owner (`/dashboard`, `/settings`, etc.) | Tenant não resolve — login falha ou tenant inacessível |
| Leads/conversas existentes | Permanecem no banco |

### Reativar

Mesmo fluxo → clique **Ativar** → status **Ativo**.

> Preferível a **excluir** quando o cliente pausa contrato ou há inadimplência temporária.

---

## Como excluir tenant

V0.1 **não** possui botão de exclusão no `/admin`. Exclusão é **irreversível** e manual.

### Antes de excluir

1. **Confirme** o slug e o `tenant_id` em `/admin/tenants` ou SQL.
2. **Suspenda** primeiro (`inactive`) e valide que widget/chat pararam — janela de segurança.
3. **Exporte** dados se necessário (leads, conversas) via SQL ou Table Editor.
4. Confirme que está no projeto Supabase **prod** (project ref correto).

### Passo 1 — Identificar owner Auth

```sql
SELECT t.id AS tenant_id, t.slug, t.public_key,
       u.id AS owner_auth_id, u.email
FROM tenants t
JOIN users u ON u.tenant_id = t.id AND u.role = 'owner'
WHERE t.slug = 'cliente-slug';
```

### Passo 2 — Excluir tenant (cascade)

`DELETE` em `tenants` remove em cascata: `tenant_settings`, `users`, `leads`, `conversations`, `messages`, `knowledge_documents`, `knowledge_chunks`.

```sql
DELETE FROM tenants WHERE slug = 'cliente-slug';
-- ou: DELETE FROM tenants WHERE id = '<tenant_id>';
```

### Passo 3 — Excluir usuário no Supabase Auth

O cascade **não** remove o usuário em `auth.users`. Faça manualmente:

- Supabase → **Authentication → Users** → excluir o owner, **ou**
- `supabase.auth.admin.deleteUser(owner_auth_id)` com service role.

### Script de referência

`scripts/clean-prod-keep-admin.ts` — limpeza em lote com preview (`--execute` destrutivo). **Não** use em prod sem revisar o código e o escopo; foi feito para cleanup one-off.

---

## Como trocar owner

V0.1 suporta **1 owner por tenant**. Não há UI para transferência.

> Reexecutar `provision:tenant` com **e-mail diferente** no mesmo slug retorna **`OWNER_CONFLICT`**.

### Cenário A — Mesma pessoa, novo e-mail

1. Supabase Auth → atualize o e-mail do usuário existente, **ou** via Admin API:

```typescript
await supabase.auth.admin.updateUserById(ownerAuthId, {
  email: "novo@cliente.com.br",
  email_confirm: true,
});
```

2. Sincronize a tabela `users`:

```sql
UPDATE users
SET email = 'novo@cliente.com.br', updated_at = NOW()
WHERE id = '<owner_auth_id>';
```

### Cenário B — Pessoa nova (transferência)

1. Anote `tenant_id` e `owner_auth_id` atuais (SQL acima).
2. Crie novo usuário Auth:

```typescript
const { data } = await supabase.auth.admin.createUser({
  email: "novoowner@cliente.com.br",
  password: "SenhaSegura2026!",
  email_confirm: true,
  user_metadata: { name: "Novo Owner" },
});
const newAuthId = data.user!.id;
```

3. Troque o vínculo no banco (transação):

```sql
BEGIN;

DELETE FROM users
WHERE tenant_id = '<tenant_id>' AND role = 'owner';

INSERT INTO users (id, tenant_id, email, name, role, status)
VALUES (
  '<new_auth_id>',
  '<tenant_id>',
  'novoowner@cliente.com.br',
  'Novo Owner',
  'owner',
  'active'
);

COMMIT;
```

4. Exclua o usuário Auth antigo: `supabase.auth.admin.deleteUser('<old_owner_auth_id>')`.
5. Envie credenciais ao novo owner por canal seguro.

---

## Como verificar logs

### Vercel Runtime Logs

1. Vercel → projeto → **Logs** (ou Deployments → deployment → **Functions**).
2. Filtre por rota (`/api/chat`, `/api/widget/config`) ou por status (4xx/5xx).
3. Logs são **JSON estruturado** (stdout).

Campos comuns:

| Campo | Significado |
|-------|-------------|
| `request_id` | Correlação — também retornado no header `x-request-id` |
| `tenant_id` | UUID do tenant (quando resolvido) |
| `route` | Path da API |
| `duration_ms` | Latência |
| `status` | HTTP status |
| `level` | `info`, `warn`, `error` |
| `message` | Evento (`request_started`, `request_completed`, etc.) |

### Eventos úteis

| `message` | Quando aparece |
|-----------|----------------|
| `request_started` / `request_completed` | Toda requisição instrumentada |
| `openai_chat_call` / `openai_chat_usage` | Chamadas ao chat (tokens) |
| `openai_chat_error` | Falha OpenAI no chat |
| `openai_embedding_job` / `openai_embedding_failure` | Indexação RAG |
| Rate limit | Resposta **429** — burst em `/api/widget/config` ou `/api/chat` |

### Correlacionar um erro reportado pelo cliente

1. Reproduza o problema (ex.: `/chat?key=pk_…`).
2. Copie o `x-request-id` da resposta (DevTools → Network).
3. Busque esse ID nos Runtime Logs da Vercel.

### Supabase

- **Logs → Postgres** — queries lentas, erros de conexão.
- **Logs → Auth** — login, falhas de token.
- **Reports** — uso de disco, conexões (relevante no free tier).

### Health check contínuo

Monitore periodicamente:

```
GET /api/health → database.ok: true
```

---

## Como fazer onboarding

Onboarding = colocar um **cliente novo** em produção com widget funcionando e captura de leads.

Checklist detalhado fase a fase: **[ONBOARDING.md](./ONBOARDING.md)**.

### Resumo das fases

| Fase | O que fazer | Responsável |
|------|-------------|-------------|
| **0 — Smoke** | `/api/health`, migrações prod, env vars | Operador |
| **1 — Criar tenant** | `/admin/tenants/new` ou `provision:tenant` | Operador |
| **2 — Configurar** | Owner preenche Settings, Knowledge, embed | Owner (+ operador assiste) |
| **3 — Validar widget** | `/chat?key=…`, teste no site, lead em `/leads` | Operador |
| **4 — Go-live** | DNS wildcard, treinar owner, documentar slug/key | Operador |

### Fase 2 — Owner (painel)

Após login em `https://{slug}.agencyos.com.br/login`:

1. **`/settings`** — empresa, WhatsApp, serviços, **nome do assistente** (`assistant_label`), mensagem inicial, cor, ações rápidas.
2. **`/knowledge`** — ao menos 1 FAQ; opcional PDF.
3. **Embed** — copiar snippet `<script src="…/widget/embed.js" data-key="pk_…">` e colar no site.

**Segmentos especiais (ex.: casamento):** em Settings → Widget, troque **Nome do assistente** para algo como `Assistente do casal` e ajuste a mensagem inicial com `{{assistant_label}}`. Ver [WIDGET_CUSTOMIZATION.md](./WIDGET_CUSTOMIZATION.md).

O embed **autoajusta** a posição do botão se houver outro FAB fixo no canto (WhatsApp do site). Override manual: `data-offset-bottom="96"` no script.

### Fase 3 — Critério de aceite

1. Visitante conversa no widget.
2. Informa nome + telefone.
3. Lead aparece em **`/leads`** do owner.
4. Métricas em **`/admin`** incrementam (leads/conversas 7 dias).

### Troubleshooting rápido

| Sintoma | Ação |
|---------|------|
| `403` em `/admin` | Adicionar e-mail em `PLATFORM_ADMIN_EMAILS` + redeploy |
| `Tenant not found` | Conferir slug; em `*.vercel.app` usar `PLATFORM_APEX_TENANT_SLUG` |
| Chat não responde | Logs Vercel + `OPENAI_API_KEY` + `/api/health` |
| Lead não aparece | Pedir nome + telefone; conferir `/leads` e logs |
| FAQ ignorado | FAQ antiga sem indexação 031F | `npx tsx --env-file=.env scripts/reindex-faq-knowledge.ts --tenant-slug={slug}` ou editar e salvar FAQ no painel |
| `database.ok: false` | Pooler IPv4 — [DEPLOY.md § Troubleshooting](./DEPLOY.md#databaseok-false-com-enotfound-dbrefsupabaseco) |

---

## Tarefas recorrentes

| Tarefa | Como |
|--------|------|
| Novo cliente | [Como criar cliente](#como-criar-cliente) |
| Reset de senha | [Como resetar senha](#como-resetar-senha) |
| Pausar contrato | [Como suspender tenant](#como-suspender-tenant) |
| Offboarding definitivo | [Como excluir tenant](#como-excluir-tenant) |
| Migração schema | `npm run db:migrate` com `DATABASE_URL` prod (inclui `0010_assistant_label`) |
| Reindex FAQs | `npx tsx --env-file=.env scripts/reindex-faq-knowledge.ts` |
| Rollback deploy | Vercel → Promote deployment anterior |
| Novo operador plataforma | Adicionar e-mail em `PLATFORM_ADMIN_EMAILS` + redeploy |

---

## Referências

- [ONBOARDING.md](./ONBOARDING.md) — checklist completo do 1º cliente
- [PROVISIONING.md](./PROVISIONING.md) — CLI, idempotência, defaults
- [DEPLOY.md](./DEPLOY.md) — deploy, env vars, DNS, troubleshooting
- [MULTITENANCY.md](./MULTITENANCY.md) — subdomínio, `public_key`, isolamento
- [QA_PLAN.md](./QA_PLAN.md) — fluxos smoke F1–F6
