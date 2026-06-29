# Widget — personalização V0.1 (ISSUE-031A–031E)

Configurações em **Settings → Widget** e colunas em `tenant_settings`.

> **031E** (pós-#31): `assistant_label` + auto-offset do launcher — entregue no V0.1 com 1º cliente real. **Não** é escopo V0.2; issues #50/#43 **consomem** esta API. Ver [DEV_PLAN.md D19](DEV_PLAN.md) e [DEVELOPMENT_WAVES_V0.2.md § Entregas V0.1](DEVELOPMENT_WAVES_V0.2.md#entregas-v01-já-feitas--não-reimplementar-na-v02).

## Nome do assistente (`assistant_label`)

- Subtítulo abaixo do nome da empresa no cabeçalho do chat.
- Configurável em **Settings → Widget → Nome do assistente**.
- Default: `Funcionário Digital` (tenants antigos sem valor usam o mesmo fallback).
- API: `GET /api/widget/config` → `assistant_label`
- Também disponível na mensagem inicial via `{{assistant_label}}`.

**Exemplos por segmento:**

| Segmento | Sugestão |
|----------|----------|
| Casamento / eventos | `Assistente do casal`, `Concierge` |
| Acabamentos / reforma | `Funcionário Digital` (default) |
| Clínica / estética | `Atendimento virtual` |

## Mensagem inicial (`initial_message`)

- Template com `{{company_name}}` e `{{assistant_label}}` substituídos automaticamente.
- Exibida como primeira mensagem do assistente no widget (antes do histórico).
- Default (novos tenants):

  > Olá! Sou o {{assistant_label}} da {{company_name}}. Posso ajudar você a conhecer nossos serviços, tirar dúvidas ou solicitar um orçamento.

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

### FAQ — indexação e embeddings (031F, pós-#31)

- Chunk indexado como `Pergunta:\n…\n\nResposta:\n…` (pergunta + resposta).
- Embedding gerado ao **criar/editar** FAQ (mesmo pipeline de PDF).
- Busca **híbrida**: semântica + textual, ranking unificado (FAQ e PDF).
- FAQs antigas: `npx tsx --env-file=.env scripts/reindex-faq-knowledge.ts` (opcional `--tenant-slug=`).
- Logs V0.1: `knowledge_search_completed`, `knowledge_search_empty`, `search_knowledge_tool_called`, `faq_indexed`.

---

## Integração no site do cliente (`embed.js`)

Snippet padrão (Settings → código embed):

```html
<script src="https://app.agencyos.com.br/widget/embed.js" data-key="PUBLIC_KEY"></script>
```

O script injeta o launcher e um painel com iframe apontando para `/chat?key=…`. O site do cliente **não** precisa forkar o embed para personalizar cor (`primary_color` via API), nome do assistente (`assistant_label`) nem conteúdo (Settings).

### Posição do botão flutuante (auto-offset)

Por padrão, o embed **detecta** outros elementos `fixed`/`sticky` no canto inferior (ex.: botão WhatsApp do site) e **sobe** o launcher para não sobrepor.

| Atributo | Default | Descrição |
|----------|---------|-----------|
| `data-auto-offset` | `true` (implícito) | `false` desliga a detecção |
| `data-offset-bottom` | — | Offset fixo em px (sobrescreve auto) |
| `data-position` | `bottom-right` | `bottom-left` também suportado |

Exemplo manual (forçar 96px do fundo):

```html
<script
  src="https://app.agencyos.com.br/widget/embed.js"
  data-key="PUBLIC_KEY"
  data-offset-bottom="96"
></script>
```

A detecção roda na carga, após buscar `/api/widget/config`, no `resize` e com retentativas tardias (botões que carregam depois).

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
