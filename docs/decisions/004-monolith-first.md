# ADR-004

## Título

Monólito Modular como arquitetura inicial

---

## Status

Aceito

---

## Data

2026-06-19

---

## Contexto

O Agency OS está em fase inicial.

A prioridade é:

- velocidade
- validação
- simplicidade

Não existem evidências de necessidade para microserviços.

---

## Decisão

Utilizar Monólito Modular.

Todos os módulos residem na mesma aplicação.

---

## Estrutura

CRM

AI

Knowledge

Analytics

Agents

Workflows

Auth

Tenants

---

Cada módulo possui:

- tipos
- serviços
- repositórios
- regras

---

## Alternativas Consideradas

### Microserviços

Prós

- Escalabilidade

Contras

- Complexidade operacional
- Deploys múltiplos
- Observabilidade mais difícil

---

### Backend Distribuído

Prós

- Flexibilidade

Contras

- Complexidade sem benefício atual

---

## Consequências

Positivas

- Desenvolvimento rápido
- Deploy simples
- Menor custo

Negativas

- Possível necessidade de extração futura

---

## Estratégia de Evolução

Caso necessário:

Monólito

↓

Módulos bem definidos

↓

Extração seletiva

↓

Serviços independentes

---

## Revisar Quando

- Gargalos comprovados
- Equipe maior que 10 desenvolvedores
- Necessidade operacional real