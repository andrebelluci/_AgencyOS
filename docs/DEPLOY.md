# Deploy em produção — Agency OS (ISSUE-030)

Guia para publicar o Agency OS na **Vercel** com **Supabase** em produção.

> Escopo V0.1: deploy manual assistido. Sem CI de migração automática nem domínio customizado obrigatório no primeiro smoke — use `*.vercel.app` até configurar `*.agencyos.com.br`.

---

## Matriz de ambientes (obrigatório antes do #31)

Antes de onboardar o **1º cliente real** (#31), **produção e desenvolvimento devem estar isolados** — assim como a Vercel separa Production e Preview.

| Camada | Ambiente | Banco / backend | Dados |
|--------|----------|-----------------|-------|
| **Local** | `npm run dev` + `.env.local` | Supabase **dev** | Seed, testes, quebrar à vontade |
| **Vercel Preview** | PRs e branches (`*.vercel.app`) | Supabase **dev** (ou staging) | **Nunca** prod |
| **Vercel Production** | `main` → URL canônica | Supabase **prod** | Clientes reais, leads reais |

### Regra de ouro

> **Um projeto Supabase = um ambiente de dados.** Não use o mesmo `NEXT_PUBLIC_SUPABASE_URL` em local e em Production na Vercel.

### Vercel — escopo das env vars

No dashboard **Project Settings → Environment Variables**, marque cada variável:

| Variável | Development | Preview | Production |
|----------|:-----------:|:-------:|:----------:|
| `DATABASE_URL` | dev | dev | **prod** |
| `NEXT_PUBLIC_SUPABASE_*` | dev | dev | **prod** |
| `SUPABASE_SERVICE_ROLE_KEY` | dev | dev | **prod** |
| `OPENAI_API_KEY` | pode ser a mesma ou key de teste | idem | **prod** |
| `PLATFORM_ADMIN_EMAILS` | seu e-mail | opcional | **prod** |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | URL do preview | URL prod |

**Preview com banco de prod é perigoso:** um PR pode rodar migração, seed ou provisioning contra dados de cliente.

### Como validar que está separado

1. Compare o **project ref** na URL:
   - `.env.local` → `https://abcdef.supabase.co`
   - Vercel **Production** → deve ser **outro** ref (ex.: `https://xyzprod.supabase.co`)
2. `GET /api/health` na URL prod → `database.ok: true`
3. Crie um lead de teste em local — **não** deve aparecer no Table Editor do Supabase prod
4. `npm run provision:tenant` em local usa `.env.local` (dev); em prod use env de prod **só** quando for cliente real (#31)

### Checklist antes do #31

- [ ] Projeto Supabase **dev** para local + Preview Vercel
- [ ] Projeto Supabase **prod** só na Vercel Production
- [ ] Migrações aplicadas nos **dois** (`npm run db:migrate` com cada `DATABASE_URL`)
- [ ] Nenhum `db:seed` de desenvolvimento rodado contra prod
- [ ] 1º tenant de cliente criado via `provision:tenant` ou `/admin` **em prod**

---

## Pré-requisitos

- [ ] Issues **#39** (provisioning) e **#38** (hardening) mergeadas em `main`
- [ ] Projeto Supabase **de produção** (separado do dev)
- [ ] Conta Vercel com repositório GitHub conectado
- [ ] OpenAI API key com crédito

---

## 1. Supabase (produção)

1. Crie um projeto em [supabase.com/dashboard](https://supabase.com/dashboard) (região South America se disponível).
2. Anote as chaves em **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Copie a connection string **Transaction** (porta **6543**, pooler) em **Database → Connection string** → `DATABASE_URL`.
4. Habilite extensão **vector** (SQL Editor):

```sql
create extension if not exists vector with schema extensions;
```

5. Aplique migrações a partir da máquina local apontando para prod:

```powershell
# .env.local temporário com credenciais de PROD (não commitar)
npm run db:migrate
npm run supabase:setup
```

6. Crie o primeiro tenant:

```powershell
npm run provision:tenant
# ou npm run db:seed  (tenant slug "development" para smoke em *.vercel.app)
```

Detalhes: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) · [PROVISIONING.md](./PROVISIONING.md)

---

## 2. Vercel — projeto e deploy

### Conectar repositório

1. [vercel.com/new](https://vercel.com/new) → importar `andrebelluci/_AgencyOS`
2. Framework: **Next.js** (detectado automaticamente)
3. Build command: `npm run build` (padrão)
4. Production branch: `main`

### Variáveis de ambiente (Production + Preview)

Configure em **Project Settings → Environment Variables**:

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_APP_URL` | Sim | URL pública do app (ex.: `https://agency-os-dharmalabs.vercel.app` ou `https://app.agencyos.com.br`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase prod |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave anon/public |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Chave service_role (somente servidor) |
| `DATABASE_URL` | Sim | Postgres pooler (porta 6543) |
| `OPENAI_API_KEY` | Sim | Chat e embeddings |
| `PLATFORM_DOMAIN` | Recomendado | `agencyos.com.br` |
| `PLATFORM_APEX_TENANT_SLUG` | Recomendado | Slug usado em apex / `*.vercel.app` (ex.: `development`) |
| `PLATFORM_ADMIN_EMAILS` | Recomendado | E-mails com acesso a `/admin` (vírgula) |
| `RATE_LIMIT_IP_MAX` | Opcional | Default `60` |
| `RATE_LIMIT_IP_WINDOW_MS` | Opcional | Default `60000` |
| `RATE_LIMIT_KEY_MAX` | Opcional | Default `30` |
| `RATE_LIMIT_KEY_WINDOW_MS` | Opcional | Default `60000` |

**CLI (exemplo):**

```powershell
npx vercel env add NEXT_PUBLIC_APP_URL production
npx vercel env add PLATFORM_APEX_TENANT_SLUG production
```

### Deploy

Cada push em `main` dispara deploy de produção. Para forçar:

```powershell
npx vercel --prod
```

URL padrão: `https://<project>-<team>.vercel.app` (ex.: `https://agency-os-dharmalabs.vercel.app`).

---

## 3. Domínio customizado `*.agencyos.com.br` (go-live)

1. **Vercel** → Project → **Domains** → adicionar:
   - `agencyos.com.br` (apex)
   - `*.agencyos.com.br` (wildcard — requer plano Pro ou DNS configurado)
2. No registrador DNS, aponte conforme instruções da Vercel (geralmente CNAME para `cname.vercel-dns.com`).
3. Atualize `NEXT_PUBLIC_APP_URL` para a URL canônica (ex.: `https://app.agencyos.com.br`).
4. Painéis dos clientes: `https://{slug}.agencyos.com.br/dashboard`
5. Widget embed: `https://app.agencyos.com.br/widget/embed.js` (ou domínio apex configurado)

---

## 4. Smoke pós-deploy

Execute na **URL de produção**:

| Check | URL / ação | Esperado |
|-------|------------|----------|
| Health | `GET /api/health` | `200` JSON |
| Home | `/` | Página marketing carrega |
| Login | `/login` | Formulário de login |
| Dashboard | Login owner → `/dashboard` | Métricas do tenant |
| Chat | `/chat` | Widget interno responde |
| Widget API | `GET /api/widget/config?key={public_key}` | JSON config + header `x-request-id` |
| Rate limit | Burst em `/api/widget/config` | `429` após limite |

Script automatizado (com servidor rodando):

```powershell
$env:NEXT_PUBLIC_APP_URL="https://agency-os-dharmalabs.vercel.app"
$env:TEST_PUBLIC_KEY="pk_..."
npx tsx scripts/test-hardening-issue-038.ts
```

Fluxos completos: [QA_PLAN.md](./QA_PLAN.md) (F1–F6).

---

## 5. Operação

| Tarefa | Como |
|--------|------|
| Novo cliente | `npm run provision:tenant` com `.env` de prod |
| Logs | Vercel → Deployments → Functions / Runtime Logs |
| Migração schema | `npm run db:migrate` contra `DATABASE_URL` prod |
| Rollback | Vercel → Promote deployment anterior |
| Superadmin | `/admin` com e-mail em `PLATFORM_ADMIN_EMAILS` |

---

## 6. Troubleshooting

### Build falha com "Duplicate function implementation" em `scripts/`

Scripts CLI estão excluídos do `tsconfig.json` (`exclude: ["scripts"]`). Se o erro persistir, limpe cache: `Remove-Item -Recurse -Force .next`.

### `Tenant not found` em produção

- Confirme tenant ativo no Supabase prod.
- Em `*.vercel.app`, defina `PLATFORM_APEX_TENANT_SLUG` com slug existente (ex.: `development`).
- Em produção real, use subdomínio `{slug}.agencyos.com.br`.

### `Missing or invalid public environment variables`

Falta `NEXT_PUBLIC_APP_URL` ou chaves Supabase no dashboard Vercel. Redeploy após adicionar.

### `database.ok: false` com `ENOTFOUND db.*.supabase.co`

A Vercel (IPv4) pode não resolver o host direto `db.[ref].supabase.co` (IPv6-only).

**Solução (escolha uma):**

1. **IPv4 add-on** no Supabase → Project Settings → Add-ons → IPv4 → habilitar. Use a nova connection string IPv4 no `DATABASE_URL` da Vercel.
2. Copiar a connection string **Transaction pool** exata do dashboard Supabase (Settings → Database → Connection string) — não montar manualmente.
3. Validar: `GET /api/health` deve retornar `"database": { "ok": true }`.

> O app normaliza porta `5432` → `6543` e adiciona `pgbouncer=true` + `sslmode=require` para hosts `db.*.supabase.co`.

---

## Referências

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- [PROVISIONING.md](./PROVISIONING.md)
- [MULTITENANCY.md](./MULTITENANCY.md)
- [DEVELOPMENT_WAVES_V0.1.md](./DEVELOPMENT_WAVES_V0.1.md) — Onda 7 V0.1
- [DEVELOPMENT_WAVES_V0.2.md](./DEVELOPMENT_WAVES_V0.2.md) — V0.2 ativo
