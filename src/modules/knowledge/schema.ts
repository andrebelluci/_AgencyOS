import { z } from "zod";

export const faqFormSchema = z.object({
  question: z.string().trim().min(1, "Informe a pergunta."),
  answer: z.string().trim().min(1, "Informe a resposta."),
});

export type FaqFormValues = z.infer<typeof faqFormSchema>;
