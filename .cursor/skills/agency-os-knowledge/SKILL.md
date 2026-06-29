---
name: agency-os-knowledge
description: Pipeline RAG do Agency OS — upload, chunking, embeddings pgvector, searchKnowledge. Use para base de conhecimento, FAQ, PDF ou tool searchKnowledge.
---

# Knowledge & RAG — Agency OS

## Pipeline

```
FAQ → Pergunta + Resposta (chunk único) → embedding (OpenAI) → knowledge_chunks
PDF → Supabase Storage → extract → chunk → embed → knowledge_chunks
Query → busca semântica + textual → merge ranking → top-K
```

## FAQ (V0.1 — 031F)

- Chunk: `Pergunta:\n{question}\n\nResposta:\n{answer}`
- Embedding ao criar/editar (`indexFaqChunk`)
- Reindex em lote: `npx tsx --env-file=.env scripts/reindex-faq-knowledge.ts`
- Painel exibe pergunta/resposta; chunk armazena formato completo

## PDF

- Supabase Storage → extract → chunk → embed
- Path: `{tenant_id}/documents/{file_id}.pdf`

## searchKnowledge

- Input: `query`, `tenant_id`, optional `topK`
- Semântica (pgvector) + textual (tsvector + title) → merge por score
- Retorna `documentType`: `faq` | `pdf`
- Logs: `knowledge_search_completed` / `knowledge_search_empty`
- Retornar vazio se sem match — agente não inventa

## Tabelas

`knowledge_documents` + `knowledge_chunks` (embedding vector na coluna)

Consulte `docs/WIDGET_CUSTOMIZATION.md` (031F), `docs/DATABASE.md` e `docs/PROMPT_SYSTEM.md`.
