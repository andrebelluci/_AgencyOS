---
name: agency-os-knowledge
description: Pipeline RAG do Agency OS — upload, chunking, embeddings pgvector, searchKnowledge. Use para base de conhecimento, FAQ, PDF ou tool searchKnowledge.
---

# Knowledge & RAG — Agency OS

## Pipeline

```
Documento → chunk (500-1000 tokens) → embedding (OpenAI) → knowledge_chunks.embedding → busca top-K
```

## Tipos V0.1

- `faq` — texto direto, chunk opcional
- `pdf` — Supabase Storage → extract → chunk → embed
- `text` — texto livre

## searchKnowledge tool

- Input: `query`, `tenant_id`
- Cosine similarity via pgvector
- Top 3-5 chunks
- Retornar vazio se sem match — agente não inventa

## Tabelas

`knowledge_documents` + `knowledge_chunks` (embedding vector na coluna)

## Storage

Path: `{tenant_id}/documents/{file_id}.pdf`

Consulte `docs/DATABASE.md` seção MVP e `docs/PROMPT_SYSTEM.md` Knowledge Agent (interno).
