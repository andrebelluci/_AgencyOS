import { z } from "zod";

export const heroChatRequestSchema = z.object({
  public_key: z.string().trim().min(1, "public_key is required."),
  action: z.enum(["start", "answer"]),
  value: z.string().trim().optional(),
  conversation_id: z.string().uuid().optional(),
  visitor_id: z.string().trim().min(1).max(128).optional(),
});

export type HeroChatRequestInput = z.infer<typeof heroChatRequestSchema>;

export const heroChatQuerySchema = z.object({
  public_key: z.string().trim().min(1, "public_key is required."),
  conversation_id: z.string().uuid("conversation_id must be a valid UUID."),
});

export type HeroChatQueryInput = z.infer<typeof heroChatQuerySchema>;
