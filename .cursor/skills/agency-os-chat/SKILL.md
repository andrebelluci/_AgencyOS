---
name: agency-os-chat
description: Implementa chat IA, widget embed, streaming SSE e API pública do Agency OS. Use para widget, /api/chat, embed.js, ou integração OpenAI com agentes.
---

# Chat & Widget — Agency OS

## Fluxo

```
Widget → POST /api/chat (SSE) → Orchestrator → Sales Agent → tools → persist messages
```

## API /api/chat

- Input: `public_key`, `conversation_id`, `message`
- Output: SSE stream
- Criar conversation se não existir
- Persistir user + assistant messages

## Agent loop

1. Montar prompt (4 camadas)
2. OpenAI com function calling
3. Executar tools (createLead, searchKnowledge)
4. Stream resposta final

## Widget embed.js

```html
<script src="https://app.agencyos.com.br/widget/embed.js" data-key="PUBLIC_KEY"></script>
```

Injeta botão flutuante → abre chat em modal/iframe apontando para `/chat`.

## Animações — onde codar

| Agency OS (`embed.js`, `/chat`) | Site do cliente (CSS/JS) |
|--------------------------------|--------------------------|
| Abrir/fechar painel, hover launcher, ícone | Pulse decorativo, reveal da demo, hero teaser |
| Typing, mensagens, streaming | Layout ao redor do widget |

Regra: comportamento do widget → Agency OS; página ao redor → host. Overrides leves no host (ex.: `.aos-embed-launcher` + `prefers-reduced-motion`) são OK. Avatar/modos ricos → V0.2+ no embed.

Ver [WIDGET_CUSTOMIZATION.md](../../docs/WIDGET_CUSTOMIZATION.md).

## WhatsApp

Após lead capturado: `buildWhatsAppLink` → botão no chat.

Sem WhatsApp Business API no V0.1.

Consulte `docs/DEV_PLAN.md` fluxos e `docs/AGENTS.md` Sales Agent.
