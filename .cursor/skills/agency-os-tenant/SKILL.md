---
name: agency-os-tenant
description: Padrões multi-tenant do Agency OS — tenant_id, RLS, resolução por subdomínio e public_key. Use ao criar tabelas, queries, APIs públicas ou middleware.
---

# Multi-Tenant — Agency OS

## Resolução de tenant

1. Subdomínio: `{slug}.agencyos.com.br`
2. Widget: header/param `public_key`
3. Dev: tenant `development` em localhost

## Toda query

```typescript
// Sempre filtrar
.where(eq(table.tenantId, tenantId))
```

## API pública (widget)

- Identificar tenant por `public_key` (não expor tenant_id interno)
- CORS restrito ou `*` com public_key obrigatório
- Rate limit futuro — preparar estrutura

## RLS Supabase

Política: `tenant_id = current_setting('app.tenant_id')` ou join com auth.

## Configuração

Personalização via `tenant_settings`, nunca código por cliente.

Consulte `docs/MULTITENANCY.md` e `docs/NON_NEGOTIABLES.md`.
