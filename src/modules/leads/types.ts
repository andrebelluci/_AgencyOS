import type { Lead } from "@/lib/db";

export type CreateLeadInput = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  source?: string | null;
  status?: Lead["status"];
  score?: Lead["score"] | null;
  notes?: string | null;
};

export type UpdateLeadInput = Partial<CreateLeadInput>;
