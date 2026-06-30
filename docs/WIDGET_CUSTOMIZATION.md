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

- Cor de marca do tenant — usada como **accent** em temas claro e escuro.
- Formato: `#RRGGBB` (validado no painel).
- Aplicada em: botão flutuante (`embed.js`), cabeçalho do chat, botão enviar, CTA e chips de ação rápida.
- Default: `#1e40af`
- API pública: `GET /api/widget/config` → `primary_color`

## Tema do widget (`widget_theme`) — V0.2 (ISSUE-045)

- Valores: `light` | `dark` | `auto`
- Configurável em **Settings → Widget → Tema do widget**
- Default: `light` (tenants antigos sem valor)
- API: `GET /api/widget/config` → `theme`
- `auto` segue `prefers-color-scheme` do visitante (OS/navegador)
- O iframe **não** herda o CSS escuro do site hospedeiro — configure `dark` ou `auto` quando o site do cliente for escuro
- Contraste pensado para WCAG AA com variáveis Shadcn (`globals.css` `.dark`)

### Override no embed (`data-theme`)

Opcional no script do site — sobrescreve o setting do tenant **somente naquela página**:

```html
<script
  src="https://app.agencyos.com.br/widget/embed.js"
  data-key="PUBLIC_KEY"
  data-theme="dark"
></script>
```

Valores: `light`, `dark`, `auto`. Sem o atributo, usa o tema salvo em Settings.

O painel do embed (chrome fora do iframe) acompanha o mesmo tema resolvido.

## Hero conversacional (`hero_flow`) — V0.2 (ISSUE-036)

Modo **inline** na hero do site: fluxo guiado por estados pré-definidos (serviço → cidade → prazo → contato), **sem LLM** gerando layout ou HTML. Transições e CTAs vêm de regras em `tenant_settings.hero_flow` (JSON).

### Ativar

- Coluna `hero_flow` em `tenant_settings` (migration `0013_hero_flow.sql`)
- Se `null`, o sistema usa o fluxo padrão com serviços do tenant
- `enabled: false` desliga o modo hero na API (`403`)

### Passos padrão

| Campo | Tipo | Pergunta |
|-------|------|----------|
| `service` | escolha | Qual serviço você procura? |
| `city` | texto | Em qual cidade está sua obra? |
| `deadline` | escolha | Qual seu prazo? |
| `name` | texto | Qual seu nome? |
| `phone` | texto | Qual seu WhatsApp? |

Ao concluir: lead `qualificado` com `source: hero`, mensagens em `conversations`/`messages`, CTA WhatsApp se configurado.

### Snippet iframe (hero inline)

```html
<iframe
  src="https://app.agencyos.com.br/chat?key=PUBLIC_KEY&mode=hero&inline=1"
  title="Atendimento"
  style="width:100%;max-width:480px;height:min(520px,70vh);border:0;border-radius:12px"
  allow="clipboard-write"
></iframe>
```

Parâmetros:

| Query | Descrição |
|-------|-----------|
| `key` | `public_key` do tenant |
| `mode=hero` | Ativa fluxo conversacional guiado |
| `inline=1` | Layout compacto para embutir na hero |
| `theme` | Override opcional: `light`, `dark`, `auto` |

### API pública

- `POST /api/chat/hero` — `action: start | answer`, persiste mensagens
- `GET /api/chat/hero?public_key=&conversation_id=` — restaura estado

Demo local: `/demo/hero` (tenant dev `pk_dev_local`).

### Exemplo de configuração JSON

```json
{
  "enabled": true,
  "welcomeMessage": "Olá! Vou fazer algumas perguntas rápidas.",
  "completionMessage": "Perfeito! Fale conosco pelo WhatsApp.",
  "steps": [
    {
      "id": "service",
      "type": "choice",
      "field": "service",
      "question": "Qual serviço você procura?",
      "optionsSource": "services"
    },
    {
      "id": "city",
      "type": "text",
      "field": "city",
      "question": "Em qual cidade está sua obra?",
      "placeholder": "Ex: Campinas"
    }
  ]
}
```

`optionsSource: "services"` usa a lista de serviços do tenant em Settings.

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

Por padrão, o embed **detecta** outros FABs pequenos (`fixed`/`sticky`, até ~280×80px) no canto inferior (ex.: grupo WhatsApp) e **sobe** o launcher para não sobrepor. **Ignora** automaticamente: banners de cookie, `#back-to-top`, overlays fullscreen (intro, decoração) e elementos com `data-aos-offset-ignore="true"`.

| Atributo | Default | Descrição |
|----------|---------|-----------|
| `data-auto-offset` | `true` (implícito) | `false` desliga a detecção |
| `data-offset-bottom` | — | Offset fixo em px (sobrescreve auto) |
| `data-max-offset` | `140` | Teto do auto-offset em px |
| `data-offset-ignore` | — | Seletores CSS extras a ignorar (vírgula) |
| `data-position` | `bottom-right` | `bottom-left` também suportado |
| `data-theme` | — | Override opcional: `light`, `dark` ou `auto` (sobrescreve Settings) |
| `data-z-index` | `9990` | Z-index do root **com chat fechado** (cookie/banner do site pode ficar acima). Com chat aberto, sobe para `2147483646` automaticamente. |

**Painel fechado não bloqueia cliques:** `.aos-embed-panel` usa `pointer-events: none` e `visibility: hidden` até `.aos-open`. No mobile, layout fullscreen (`aos-embed-panel-mobile`) só é aplicado com chat aberto.

O embed publica no `:root` as variáveis `--aos-embed-launcher-bottom`, `--aos-embed-launcher-size` e `--aos-embed-launcher-stack` (offset + tamanho + safe-area) para o site empilhar botões próprios (ex.: voltar ao topo) sem chute fixo em `58px`.

**Blindagem automática (embed):** ignora overlays fullscreen, cookie/consent/GDPR, `#back-to-top`, dialogs; só empilha FABs pequenos; teto `data-max-offset`; congela offset com chat aberto; `MutationObserver` + `visualViewport` + retentativas até 10s para widgets tardios; open shadow DOM; `env(safe-area-inset-*)` no iOS; histerese anti-tremor; evento `agencyos:launcher-offset`.

**API JS (opcional no site):**

```js
window.AgencyOSWidget.getLauncherBottom(); // px lógicos do fundo
window.AgencyOSWidget.recalculateOffset(); // após injetar FAB próprio
window.dispatchEvent(new Event("agencyos:recalculate-offset"));
window.addEventListener("agencyos:launcher-offset", (e) => {
  console.log(e.detail.bottom, e.detail.size);
});
```

**O site ainda deve:** posicionar botões próprios com `--aos-embed-launcher-stack` (ou ouvir o evento), não sobrescrever `.aos-embed-launcher`, e restaurar `overflow` após intros modais.

Exemplo com tema escuro forçado no site:

```html
<script
  src="https://app.agencyos.com.br/widget/embed.js"
  data-key="PUBLIC_KEY"
  data-theme="dark"
></script>
```

Exemplo manual de offset (forçar 96px do fundo):

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

Detalhes visuais gerais: [DESIGN.md](DESIGN.md).
