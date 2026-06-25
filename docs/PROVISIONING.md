# Tenant Provisioning

Fluxo **manual assistido** para criar um novo cliente (tenant) na plataforma Agency OS.

> Escopo V0.1: operador interno executa o comando. Não há self-service, e-mail automático nem cobrança.

---

## Pré-requisitos

1. `.env.local` configurado (`DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) — ver [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).
2. Migrações aplicadas (`npm run db:migrate` ou `db:push`).
3. Acesso à `service_role` key do Supabase (somente servidor/CLI).

---

## Provisionar via CLI

```bash
npm run provision:tenant -- \
  --company "Belluci Acabamentos" \
  --email owner@belluci.com.br \
  --password "SenhaSegura2026!" \
  --name "Maria Belluci"
```

**Windows (PowerShell)** — `npm run` pode engolir flags. Use uma das opções:

```powershell
# Variáveis de ambiente (recomendado no Windows)
$env:PROVISION_COMPANY="Belluci Acabamentos"
$env:PROVISION_EMAIL="owner@belluci.com.br"
$env:PROVISION_PASSWORD="SenhaSegura2026!"
$env:PROVISION_NAME="Maria Belluci"
npm run provision:tenant
```

```powershell
# Ou invoque o script diretamente
npx tsx --env-file=.env.local scripts/provision-tenant.ts --company "Belluci" --email owner@belluci.com.br --password "SenhaSegura2026!"
```

| Flag | Obrigatório | Descrição |
|------|-------------|-----------|
| `--company` | Sim | Nome da empresa (vira `company_name` nas settings) |
| `--email` | Sim | E-mail do owner (Supabase Auth) |
| `--password` | Sim | Senha inicial (mín. 8 caracteres) |
| `--slug` | Não | Slug do subdomínio; se omitido, derivado do nome |
| `--name` | Não | Nome exibido do owner |

### Saída esperada

O comando imprime:

- `tenant_id`, `slug`, `public_key`
- Credenciais do owner (`email` / `password`)
- URL do painel: `https://{slug}.agencyos.com.br/dashboard`

Entregue as credenciais ao cliente por canal seguro (WhatsApp, reunião, etc.).

---

## O que é criado

| Recurso | Detalhe |
|---------|---------|
| `tenants` | `name`, `slug`, `public_key` (crypto-safe), `status = active` |
| `tenant_settings` | Defaults: `welcome_message`, `primary_color`, `services = []` |
| Supabase Auth | Usuário owner com e-mail confirmado |
| `users` | Row `role = owner`, vinculada ao `tenant_id` |

### `public_key`

Gerada com `crypto.randomBytes` (prefixo `pk_`). Única na tabela `tenants`. Em colisão rara, o service tenta novamente automaticamente.

### Settings padrão

- `company_name` = `--company`
- `welcome_message` = "Olá! Como posso ajudar você hoje?"
- `primary_color` = `#1e40af`
- `services` = `[]`
- Demais campos (`whatsapp`, `city`, etc.) = `null` até o cliente configurar no painel

---

## Idempotência (slug duplicado)

Se o **slug já existir**:

- **Mesmo e-mail de owner** → comando é idempotente: garante settings, auth e row em `users`; retorna `created: false`; **não** altera `public_key`.
- **E-mail diferente** → erro `OWNER_CONFLICT` (slug já pertence a outro cliente).

Reexecutar o comando com o mesmo slug e owner é seguro para “reparar” settings ou senha do owner.

---

## Acesso ao painel

O tenant é resolvido por **subdomínio**:

```
https://{slug}.agencyos.com.br/login
```

Em desenvolvimento local, `localhost` aponta sempre para o tenant `development` (seed). Para testar um tenant provisionado localmente:

1. Adicione ao `hosts`: `127.0.0.1 acme.agencyos.com.br`
2. Acesse: `http://acme.agencyos.com.br:3000/login`

---

## Uso programático

```typescript
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

import { provisionTenant } from "@/modules/provisioning";

const sql = postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const result = await provisionTenant(
  {
    companyName: "Acme",
    ownerEmail: "owner@acme.com",
    ownerPassword: "SenhaSegura1",
  },
  { sql, supabase },
);

await sql.end();
```

A área `/admin` (ISSUE-032) reutilizará este service.

---

## Checklist do operador

- [ ] Executar `npm run provision:tenant` com dados do cliente
- [ ] Anotar `public_key` para embed do widget
- [ ] Enviar credenciais ao owner
- [ ] Validar login em `https://{slug}.agencyos.com.br/login`
- [ ] Cliente completa Configurações (WhatsApp, serviços, etc.)

---

## Referências

- Seed de desenvolvimento: `npm run db:seed` (tenant `development`)
- [MULTITENANCY.md](./MULTITENANCY.md)
- BACKLOG ISSUE-034 / GitHub #39
