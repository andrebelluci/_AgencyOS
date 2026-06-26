---
name: agency-os-widget-ui
description: Padrões UI do widget de chat e painel admin do Agency OS. Use ao criar componentes em src/components/chat, src/components/dashboard, src/app/(widget), src/app/(dashboard), ou quando o usuário pedir widget, painel, dashboard, ou interface do Funcionário Digital.
---

# Agency OS — Widget & Painel UI

## Antes de codar

1. Ler `docs/DESIGN.md`
2. Invocar `/ui-ux-pro-max` se precisar de paleta/layout para landing ou hero
3. Herdar `primary_color` do tenant no widget

## Widget (prioridade V0.1)

```
[Header: nome empresa + fechar]
[Mensagens scroll]
[Input + enviar]
[CTA WhatsApp quando lead capturado]
```

- Estados: idle, streaming, error, lead-captured
- `visitor_id` anônimo — sem exigir login
- Mensagem de boas-vindas configurável via tenant_settings (`initial_message`)
- Animações estruturais (launcher, painel, chat) = Agency OS; pulse/teaser na landing = site do cliente (ver `docs/WIDGET_CUSTOMIZATION.md`)

## Animações — regra rápida

- **Agency OS:** `embed.js` + `/chat` (abrir/fechar, hover, ícone, typing)
- **Site hospedeiro:** CSS decorativo (pulse em `.aos-embed-launcher`, reveal de demo) com `prefers-reduced-motion`
- **V0.2+:** avatar, modos — evoluir embed, não fork no site

## Painel admin

Páginas V0.1:
- `/` — 3 cards: conversas, leads, leads semana
- `/leads` — tabela + badge status
- `/conversations` — lista + drawer com messages
- `/knowledge` — upload FAQ/PDF
- `/settings` — form + snippet embed

## Componentes Shadcn sugeridos

Button, Input, Textarea, Card, Table, Badge, Sheet, Dialog, Skeleton, ScrollArea

## Não fazer no V0.1

- Gráficos complexos (Recharts) — só contagens
- Drag-and-drop pipeline
- Temas customizáveis pelo usuário além de primary_color
