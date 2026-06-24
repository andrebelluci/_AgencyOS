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
