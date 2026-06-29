# ADR-005

## Título

RAG First (Knowledge First)

---

## Status

Aceito

---

## Data

2026-06-29

---

## Contexto

O principal valor do Funcionário Digital é responder utilizando o **conhecimento específico da empresa**.

Responder apenas com conhecimento geral do modelo reduz a confiança do sistema e descaracteriza o produto. O diferencial do Agency OS não é possuir um LLM — é representar o conhecimento interno de cada tenant de forma confiável.

---

## Decisão

Sempre que uma pergunta puder estar relacionada ao conhecimento interno da empresa, o sistema deve **consultar a Knowledge Base antes** de formular a resposta.

O modelo é responsável por interpretar, organizar e comunicar o conhecimento recuperado.

O modelo **não** deve substituir a Knowledge Base.

---

## Regra

Se a informação existe na Knowledge Base e o agente não a utiliza corretamente, isso é considerado **bug da plataforma**.

Não é melhoria futura. Não é limitação aceitável do modelo.

---

## Exemplos de domínios cobertos

- serviços
- produtos
- preços
- horários
- políticas
- garantias
- dress code
- procedimentos
- perguntas frequentes
- formas de pagamento
- regras internas
- diferenciais da empresa
- formas de atendimento

---

## Alternativas consideradas

### Confiar no conhecimento geral do LLM

Prós

- Implementação mais simples
- Respostas imediatas sem pipeline RAG

Contras

- Respostas genéricas e incorretas para o tenant
- Produto indistinguível de chatbot comum
- Viola NON_NEGOTIABLES (REGRA 15 — nunca inventar dados)

---

### RAG opcional (somente quando o agente “achar necessário”)

Prós

- Menos chamadas à tool em conversas puramente comerciais

Contras

- Comportamento imprevisível
- Falhas silenciosas quando o modelo não invoca `searchKnowledge`
- Dificulta QA e operação

---

## Consequências

Positivas

- FAQ e PDF possuem o **mesmo peso** como fontes de conhecimento
- FAQ deve possuir embeddings (paridade com PDF na busca semântica)
- A recuperação de conhecimento é parte **crítica** da plataforma
- Melhorias de RAG têm prioridade sobre novas interfaces quando afetarem confiabilidade
- Agentes atuais e futuros compartilham a mesma filosofia documentada

Negativas

- Dependência operacional de base de conhecimento bem mantida pelo cliente
- Custo de embedding e latência adicional em perguntas factuais
- Exige testes de paráfrase e observabilidade contínua

---

## Complementos V0.2 (não substituem esta decisão)

| Issue | Entrega | Relação com ADR-005 |
|-------|---------|---------------------|
| [#51](https://github.com/andrebelluci/_AgencyOS/issues/51) (ISSUE-044) | Citação visível da fonte (FAQ/PDF) na resposta do chat | **Complementa** a UX de confiança; **não dispensa** consultar a Knowledge Base antes de responder |
| #49 (Support Agent) | Agente dedicado a FAQ/garantias | Estende RAG FIRST a roteamento Orchestrator → Support |

A citação de fonte melhora transparência; ignorar a base quando há conteúdo recuperável continua sendo **bug** (REGRA 21 + esta ADR).

---

## Relacionados

- [NON_NEGOTIABLES.md](../NON_NEGOTIABLES.md) — REGRA 21 KNOWLEDGE FIRST
- [AGENTS.md](../AGENTS.md) — regras RAG FIRST por agente
- [QA_PLAN.md](../QA_PLAN.md) — cenário obrigatório de paráfrase FAQ
- [DEV_PLAN.md](../DEV_PLAN.md) — decisão D20
- [BACKLOG.md](../BACKLOG.md) — ISSUE-044 (#51) citação RAG
- [VISION.md](../VISION.md) — “RAG privado por padrão” (diretriz estratégica alinhada)

---

## Revisar quando

- Digital Twin consolidar memória longa além de FAQ/PDF
- Novas fontes de conhecimento (APIs externas, CRM) entrarem no pipeline de recuperação
- Política de citação de fonte (#51) alterar contrato de resposta no chat
