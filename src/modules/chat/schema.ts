import { z } from "zod";

export const chatRequestSchema = z.object({
  public_key: z.string().trim().min(1, "public_key is required."),
  message: z.string().trim().min(1, "message is required."),
  conversation_id: z.string().uuid().optional(),
  visitor_id: z.string().trim().min(1).max(128).optional(),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
