# Design System — Agency OS

Referência visual para widget, painel admin e landing.  
O Cursor deve ler este arquivo antes de criar ou editar componentes UI.

---

## Personalidade

- Profissional, confiável, moderno
- Inspirado em Linear, Stripe, Vercel — não genérico "AI slop"
- Claro para donos de pequenas empresas (não técnico demais)

---

## Stack UI

- Tailwind CSS + Shadcn/UI
- Sem CSS inline, sem styled-components
- Framer Motion apenas em micro-interações (opcional V0.1)

---

## Cores (tokens)

| Token | Uso | Valor sugerido |
|-------|-----|----------------|
| `--primary` | CTAs, links ativos | Configurável por tenant (`tenant_settings.primary_color`) |
| `--background` | Fundo app | `slate-50` / dark: `slate-950` |
| `--foreground` | Texto principal | `slate-900` / dark: `slate-50` |
| `--muted` | Texto secundário | `slate-500` |
| `--border` | Bordas | `slate-200` / dark: `slate-800` |
| `--destructive` | Ações perigosas | `red-600` |

Widget herda `primary_color` do tenant. Painel usa paleta neutra com accent do tenant no logo/settings.

---

## Tipografia

- Font: `Inter` ou `Geist Sans` (via `next/font`)
- Títulos painel: `text-2xl font-semibold tracking-tight`
- Corpo: `text-sm` ou `text-base`
- Widget mensagens: `text-sm leading-relaxed`

---

## Espaçamento

Escala 4px: `p-4` cards, `gap-4` listas, `space-y-6` seções de página.

---

## Componentes

### Widget de chat
- Botão flutuante: `rounded-full`, shadow suave, canto inferior direito
- Painel chat: `rounded-xl`, `max-w-md`, altura ~500px
- Bolhas: user à direita (primary), assistant à esquerda (muted bg)
- Input fixo no rodapé com botão enviar
- Estados: loading (skeleton ou dots), erro (mensagem amigável)

### Painel admin
- Sidebar fixa + conteúdo
- Tabelas com empty state
- Cards de métrica no dashboard (número grande + label pequena)

### Formulários
- React Hook Form + Zod
- Labels visíveis, erro abaixo do campo
- Botão primário à direita em modais

---

## Acessibilidade

- Contraste WCAG AA mínimo
- `focus-visible:ring-2` em todos os interativos
- Chat: `aria-live="polite"` para novas mensagens
- Não usar cor como único indicador de status

---

## Proibido

- Gradientes roxo/azul genéricos de "AI startup"
- Emojis excessivos no painel admin
- Animações que atrasam interação
- Layout que quebra em mobile (widget e painel responsivos)

---

## Skills relacionadas

- `/ui-ux-pro-max` — design intelligence geral
- Regra `.cursor/rules/agency-os-design.mdc`
- Skill `agency-os-widget-ui` — padrões específicos do produto
