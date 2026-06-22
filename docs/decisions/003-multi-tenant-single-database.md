# ADR-003

## Título

Multi-Tenant utilizando banco único

---

## Status

Aceito

---

## Data

2026-06-19

---

## Contexto

O Agency OS foi concebido como plataforma SaaS.

A operação deverá atender múltiplas empresas utilizando a mesma aplicação.

Precisamos equilibrar:

- simplicidade
- custo
- escalabilidade

---

## Decisão

Utilizar:

Banco único

+

tenant_id em tabelas operacionais

---

## Estrutura

Tenant

↓

Users

Leads

Conversations

Quotes

Documents

Workflows

Analytics

---

## Alternativas Consideradas

### Banco por Cliente

Prós

- Isolamento

Contras

- Operação complexa
- Migrações difíceis
- Custo elevado

---

### Schema por Cliente

Prós

- Isolamento maior

Contras

- Complexidade crescente

---

## Consequências

Positivas

- Operação simples
- Menor custo
- Escalabilidade inicial excelente

Negativas

- Necessidade de disciplina rigorosa

---

## Regras

Toda tabela operacional deve possuir:

tenant_id

Toda consulta deve validar:

tenant_id

---

## Revisar Quando

- Necessidades regulatórias
- Grandes clientes Enterprise
- Requisitos específicos de isolamento