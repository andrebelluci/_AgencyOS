# ADR-001

## Título

Utilizar Next.js como framework principal

---

## Status

Aceito

---

## Data

2026-06-19

---

## Contexto

O Agency OS necessita:

- Frontend moderno
- Backend integrado
- SSR
- SEO
- Server Actions
- Deploy simples
- Escalabilidade gradual

O objetivo inicial é validar mercado rapidamente.

Não existe necessidade atual de separar frontend e backend.

---

## Decisão

Utilizar Next.js como framework principal.

Frontend e backend permanecerão no mesmo projeto.

Utilizar:

- App Router
- Server Components
- Server Actions
- Route Handlers

---

## Alternativas Consideradas

### React + Express

Prós

- Separação clara

Contras

- Mais complexidade
- Mais deploys
- Mais manutenção

---

### NestJS + React

Prós

- Arquitetura robusta

Contras

- Complexidade desnecessária para MVP

---

### Laravel

Prós

- Produtividade

Contras

- Distanciamento da estratégia baseada em TypeScript

---

## Consequências

Positivas

- Desenvolvimento rápido
- Menos infraestrutura
- Menos custo
- Melhor integração com IA

Negativas

- Possível necessidade futura de separação

---

## Revisar Quando

- Mais de 100 clientes ativos
- Necessidade clara de backend independente
- Limitações reais de escalabilidade