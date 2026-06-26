# Widget — personalização V0.1 (ISSUE-031A–031D)

Configurações em **Settings → Widget** e colunas em `tenant_settings`.

## Mensagem inicial (`initial_message`)

- Template com `{{company_name}}` substituído pelo nome da empresa.
- Exibida como primeira mensagem do assistente no widget (antes do histórico).
- Default (novos tenants):

  > Olá! Sou o Funcionário Digital da {{company_name}}. Posso ajudar você a conhecer nossos serviços, tirar dúvidas ou solicitar um orçamento.

- Fallback: `welcome_message` (legado) → template padrão.
- Resolução: `src/lib/widget/initial-message.ts`

## Ações rápidas (`quick_actions`)

JSON em `tenant_settings` — sem tabela dedicada (migrável depois).

```json
[
  {
    "label": "WhatsApp",
    "type": "whatsapp",
    "url": "",
    "enabled": true
  },
  {
    "label": "Site",
    "type": "link",
    "url": "https://exemplo.com.br",
    "enabled": true
  }
]
```

- `whatsapp`: usa `url` se preenchida; senão monta link a partir do WhatsApp do tenant.
- `link`: exige URL.
- Apenas ações `enabled: true` com URL resolvida aparecem no widget.

## Identidade visual (`primary_color`)

- Única cor de marca no V0.1 (sem temas, fontes ou modo escuro).
- **Modo escuro:** planejado V0.2 — [ISSUE-045](BACKLOG.md#issue-045-widget-dark-mode-v02) (`light` / `dark` / `auto`); ver decisão D18 em [DEV_PLAN.md](DEV_PLAN.md).
- Formato: `#RRGGBB` (validado no painel).
- Aplicada em: botão flutuante (`embed.js`), cabeçalho do chat, botão enviar, CTA e chips de ação rápida.
- Default: `#1e40af`
- API pública: `GET /api/widget/config` → `primary_color`

## Sales Agent (031C)

Prompt e regras reforçam: **RAG antes de serviços/preços**; qualificação quando não há contexto; sem respostas genéricas inventadas.

---

## Integração no site do cliente (`embed.js`)

Snippet padrão (Settings → código embed):

```html
<script src="https://app.agencyos.com.br/widget/embed.js" data-key="PUBLIC_KEY"></script>
```

O script injeta o launcher e um painel com iframe apontando para `/chat?key=…`. O site do cliente **não** precisa forkar o embed para personalizar cor (`primary_color` via API) nem conteúdo (Settings).

---

## Animações — Agency OS vs site hospedeiro

**Regra prática:** tudo que é **comportamento do widget** → Agency OS. Tudo que é **página ao redor** → CSS/JS do site do cliente.

| Animação | Onde implementar | Motivo |
|----------|------------------|--------|
| Abrir/fechar painel (fade, scale) | Agency OS (`public/widget/embed.js`) | Estrutural do widget; já implementado |
| Hover no botão flutuante | Agency OS (`embed.js`) | Mesmo motivo |
| Trocar ícone chat → avatar/logo | Agency OS (`embed.js`) | SVG injetado pelo embed |
| Mensagens, typing indicator, streaming | Agency OS (`/chat` no iframe) | UX do chat |
| Pulse sutil no launcher (atenção) | **Site do cliente** (CSS no host) | Override decorativo sem fork do embed |
| Entrada da demo inline / hero teaser | **Site do cliente** | Layout da landing, não do produto |
| Avatar animado, transição entre modos | Agency OS — **V0.2+** | Evoluir `embed.js`; não hack permanente no site |

### Override leve no site (ex.: Dharma Labs)

O launcher expõe a classe `.aos-embed-launcher`. O site pode aplicar efeitos **decorativos** (ex.: `box-shadow` pulsante) via CSS do host:

- Respeitar `prefers-reduced-motion: reduce` (desligar pulse).
- Não alterar posição, z-index ou tamanho de forma que quebre o embed em mobile.
- Não depender de override para funcionalidade (abrir chat, cor da marca, ícone).

Animações **ricas** que fazem parte do produto (avatar, modos sidebar/fullscreen, voice) ficam no roadmap V0.2+ — ver [DEV_PLAN.md](DEV_PLAN.md) e [PRODUCTS.md](PRODUCTS.md).

**Modo escuro do chat (V0.2 — ISSUE-045):** tema `light` / `dark` / `auto` por tenant; opcional `data-theme` no embed. O iframe **não** herda o CSS escuro do site hospedeiro — configure `dark` ou `auto` quando disponível.

Detalhes visuais gerais: [DESIGN.md](DESIGN.md).
