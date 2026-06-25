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

export type KnowledgeDocumentStatus =
  | "pending"
  | "processing"
  | "ready"
  | "failed";

export type PdfDocumentItem = {
  id: string;
  title: string;
  status: KnowledgeDocumentStatus;
  fileUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PdfDocumentListItem = PdfDocumentItem & {
  createdAtLabel: string;
};

export type UploadPdfInput = {
  buffer: Buffer;
  filename: string;
};
