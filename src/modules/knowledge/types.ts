export type KnowledgeSearchSource = "semantic" | "text";

export type KnowledgeSearchChunk = {
  id: string;
  documentId: string;
  content: string;
  position: number;
  score: number;
  source: KnowledgeSearchSource;
};

export type KnowledgeSearchResult = {
  chunks: KnowledgeSearchChunk[];
  source: KnowledgeSearchSource | "none";
};
