# Supabase — setup local (ISSUE-002)

Guia para configurar o projeto Supabase e o arquivo `.env.local` do Agency OS.

## 1. Criar projeto no Supabase

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard) e crie um projeto.
2. Anote a **região** (recomendado: South America se disponível).
3. Aguarde o provisionamento do Postgres.

## 2. Obter chaves da API

No dashboard: **Project Settings → API**

| Variável | Onde encontrar |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (secreta — nunca no client) |

## 3. Connection string do Postgres (ISSUE-003)

No dashboard: **Project Settings → Database → Connection string → URI**

Use o modo **Transaction** (porta **6543**) para serverless/Vercel:

```
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:6543/postgres?pgbouncer=true
```

> O app normaliza automaticamente URLs com porta `5432` para `6543` em runtime (`src/lib/db/client.ts`).
> Para migrações locais (`npm run db:migrate`), a connection string direta `:5432` continua válida.

> `DATABASE_URL` é **obrigatório** a partir da ISSUE-003 (`npm run db:migrate`).

## 4. Criar `.env.local`

Na raiz do repositório:

```powershell
Copy-Item .env.example .env.local
```

Edite `.env.local` e preencha:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Obrigatório para Drizzle (ISSUE-003)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Nunca** commite `.env.local` — já está no `.gitignore`.

## 5. Testar conexão e criar bucket `knowledge`

```powershell
npm run supabase:setup
```

O script:

1. Valida variáveis de ambiente
2. Testa Auth API e Storage API
3. Cria o bucket privado `knowledge` (PDF/texto para RAG)

Saída esperada:

```
Auth API: OK
Storage API: OK (N bucket(s))
Bucket "knowledge" criado.
Setup concluído. Conexão testada; bucket knowledge pronto.
```

## 6. Verificar via API

Com o dev server rodando:

```powershell
npm run dev
```

```powershell
curl http://localhost:3000/api/health
```

Resposta com Supabase configurado:

```json
{
  "status": "ok",
  "service": "agency-os",
  "version": "0.1.0",
  "supabase": {
    "configured": true,
    "auth": { "ok": true },
    "storage": { "ok": true, "buckets": ["knowledge"] },
    "knowledgeBucket": { "exists": true }
  }
}
```

## Clientes no código

| Arquivo | Uso |
|---------|-----|
| `src/lib/supabase/client.ts` | Client Components (browser) |
| `src/lib/supabase/server.ts` | Server Components, Route Handlers, Actions |
| `src/lib/supabase/admin.ts` | Service role — apenas server, bypass RLS |

## Próximas issues

| Issue | Escopo |
|-------|--------|
| ISSUE-003 | Drizzle + migrations (`tenants`, `users`, …) |
| ISSUE-005 | Auth UI + middleware de sessão |
| ISSUE-006 | RLS por `tenant_id` |

## 8. RLS Onda 1 (ISSUE-006)

Migration `0001_rls_wave1_base_tables.sql` habilita RLS em `tenants`, `tenant_settings` e `users`.

| Papel | Comportamento |
|-------|----------------|
| `service_role` | Bypass RLS (admin, seeds, onboarding) |
| `authenticated` | Só vê dados do próprio tenant via `public.current_tenant_id()` |
| `anon` | Sem políticas — acesso negado |

A função `current_tenant_id()` prioriza `auth.uid()` → `public.users.tenant_id`. `SET LOCAL app.tenant_id` só vale sem JWT (testes SQL).

Helper app: `withTenantContext()` em `src/lib/db/tenant-context.ts`.

Verificar isolamento:

```powershell
npm run db:migrate
npm run db:test-rls
```

| ISSUE-020 | Extensão `pgvector` |
| ISSUE-024 | Upload PDF → bucket `knowledge` |

## Troubleshooting

**`Missing or invalid environment variables`** — `.env.local` ausente ou chaves vazias.

**`Failed to list buckets`** — `SUPABASE_SERVICE_ROLE_KEY` incorreta ou projeto pausado.

**Storage desabilitado** — em Project Settings, confirme que Storage está habilitado.

## 7. Migrations Drizzle (ISSUE-003)

Com `DATABASE_URL` preenchido:

```powershell
npm run db:migrate
```

Alternativa para prototipagem local (sem histórico de migration):

```powershell
npm run db:push
```

Verificar tabelas no Supabase: **Table Editor** → `tenants`, `tenant_settings`, `users`.
