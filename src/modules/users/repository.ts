import "server-only";

import { eq } from "drizzle-orm";

import { getDb, users, type User } from "@/lib/db";

export async function findUserById(id: string): Promise<User | undefined> {
  const [row] = await getDb()
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return row;
}

export async function createUser(record: {
  id: string;
  tenantId: string;
  email: string;
  name?: string | null;
}): Promise<User> {
  const [row] = await getDb()
    .insert(users)
    .values({
      id: record.id,
      tenantId: record.tenantId,
      email: record.email,
      name: record.name ?? null,
      role: "owner",
      status: "active",
    })
    .returning();

  if (!row) {
    throw new Error("Failed to create user record.");
  }

  return row;
}
