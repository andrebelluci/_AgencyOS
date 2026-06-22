# ADR-002

## Título

Utilizar Supabase como plataforma inicial

---

## Status

Aceito

---

## Data

2026-06-19

---

## Contexto

O Agency OS necessita:

- Autenticação
- Banco PostgreSQL
- Storage
- Segurança
- Deploy rápido

O foco atual é validação e aquisição de clientes.

---

## Decisão

Utilizar Supabase para:

- PostgreSQL
- Auth
- Storage

Inicialmente evitar infraestrutura própria.

---

## Alternativas Consideradas

### AWS

Prós

- Escalabilidade

Contras

- Complexidade
- Custo operacional

---

### Firebase

Prós

- Facilidade

Contras

- Não PostgreSQL
- Menor aderência ao roadmap

---

### Infraestrutura Própria

Prós

- Controle total

Contras

- Complexidade prematura

---

## Consequências

Positivas

- Velocidade
- Menor custo inicial
- Menor manutenção

Negativas

- Dependência temporária de fornecedor

---

## Mitigações

Arquitetura deve permitir migração futura.

Nenhuma regra de negócio deve depender diretamente do Supabase.

---

## Revisar Quando

- Limitações de custo
- Limitações técnicas
- Necessidade de infraestrutura própria