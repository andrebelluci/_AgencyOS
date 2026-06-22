# NON NEGOTIABLES

## Objetivo

Este documento define os princípios que nunca podem ser violados.

Quando houver dúvidas técnicas, comerciais ou estratégicas, estas regras possuem prioridade máxima.

---

# REGRA 1

MULTI-TENANT DESDE O PRIMEIRO COMMIT

---

Toda funcionalidade deve funcionar para:

- 1 cliente
- 10 clientes
- 100 clientes

Nunca criar código específico para um cliente.

Nunca criar projetos separados.

Existe apenas um produto.

---

# REGRA 2

UM CÓDIGO PARA TODOS

---

Todos os clientes utilizam:

- mesmo frontend
- mesmo backend
- mesmos agentes
- mesmas automações

Diferenças devem ser configurações.

Nunca código customizado.

---

# REGRA 3

CONFIGURAÇÃO ACIMA DE CUSTOMIZAÇÃO

---

Sempre perguntar:

Isso pode ser resolvido com configuração?

Se sim:

Não criar código novo.

---

# REGRA 4

O CLIENTE NÃO COMPRA UM SITE

---

O cliente compra:

- mais vendas
- mais leads
- mais eficiência
- mais atendimento

Toda funcionalidade deve gerar resultado.

---

# REGRA 5

IA NÃO É UM COMPLEMENTO

---

IA é parte da arquitetura.

Não é uma funcionalidade extra.

Não é um widget.

Não é um chatbot isolado.

---

# REGRA 6

AGENTES POSSUEM RESPONSABILIDADE ÚNICA

---

Um agente.

Uma função.

Uma responsabilidade.

Evitar agentes gigantes.

---

# REGRA 7

FERRAMENTAS NÃO CONHECEM AGENTES

---

Agentes usam ferramentas.

Ferramentas não sabem quem as utiliza.

Objetivo:

Desacoplamento.

---

# REGRA 8

TUDO DEVE SER AUDITÁVEL

---

Toda ação relevante deve gerar:

- log
- evento
- histórico

Nunca criar processos invisíveis.

---

# REGRA 9

TUDO DEVE SER MENSURÁVEL

---

Toda funcionalidade deve gerar métricas.

Pergunta obrigatória:

Como medir o sucesso disso?

---

# REGRA 10

TODA DECISÃO DEVE ESCALAR

---

Não otimizar para milhares de clientes.

Mas evitar decisões que impeçam crescimento.

---

# REGRA 11

SIMPLICIDADE VENCE COMPLEXIDADE

---

Sempre escolher:

- solução mais simples
- solução mais clara
- solução mais previsível

---

# REGRA 12

NÃO CRIAR COMPLEXIDADE PREMATURA

---

Evitar:

- microserviços
- kubernetes
- arquitetura distribuída
- filas complexas

até existir necessidade real.

---

# REGRA 13

VALIDAR ANTES DE ESCALAR

---

Ordem correta:

Vender

↓

Validar

↓

Automatizar

↓

Escalar

---

Nunca inverter.

---

# REGRA 14

DADOS PERTENCEM AO TENANT

---

Toda consulta deve respeitar:

tenant_id

Sempre.

Sem exceções.

---

# REGRA 15

NUNCA INVENTAR DADOS

---

Agentes nunca podem inventar:

- preços
- documentos
- serviços
- contratos
- políticas

Na dúvida:

Perguntar.

---

# REGRA 16

PROMPTS DEVEM SER CENTRALIZADOS

---

Prompts ficam:

agents/*/prompt.ts

ou

Prompt System

Nunca espalhados.

---

# REGRA 17

O CURSOR DEVE AGIR COMO CTO

---

Ao gerar código deve considerar:

- arquitetura
- escalabilidade
- manutenção
- roadmap
- visão

Não apenas a tarefa atual.

---

# REGRA 18

REUTILIZAÇÃO É O PADRÃO

---

Se código foi duplicado:

Extrair.

Se componente foi duplicado:

Extrair.

---

# REGRA 19

NÃO DEPENDER DE FORNECEDOR

---

Arquitetura deve permitir trocar:

- IA
- banco
- hospedagem
- storage

com esforço controlado.

---

# REGRA 20

A MISSÃO VEM ANTES DA TECNOLOGIA

---

Tecnologias mudam.

A missão permanece.

Missão:

Transformar pequenas empresas em empresas operáveis por IA.

---

# CHECKLIST

Antes de aprovar qualquer funcionalidade:

✓ Respeita multi-tenancy?

✓ É reutilizável?

✓ É simples?

✓ Escala?

✓ Gera valor?

✓ Está alinhada ao roadmap?

✓ Está alinhada à visão?

Se alguma resposta for NÃO:

Reavaliar.

---

# REGRA FINAL

Toda decisão deve aproximar o Agency OS do objetivo de se tornar o sistema operacional de pequenas empresas baseado em IA.