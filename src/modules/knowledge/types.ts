export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateFaqInput = {
  question: string;
  answer: string;
};

export type UpdateFaqInput = Partial<CreateFaqInput>;

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
