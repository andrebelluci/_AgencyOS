import { z } from "zod";

export const chatRequestSchema = z.object({
  public_key: z.string().trim().min(1, "public_key is required."),
  message: z.string().trim().min(1, "message is required."),
  conversation_id: z.string().uuid().optional(),
  visitor_id: z.string().trim().min(1).max(128).optional(),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;

export const whatsappClickRequestSchema = z.object({
  public_key: z.string().trim().min(1, "public_key is required."),
  conversation_id: z.string().uuid("conversation_id must be a valid UUID."),
});

export type WhatsAppClickRequestInput = z.infer<
  typeof whatsappClickRequestSchema
>;
