// helpers
import { eq } from "drizzle-orm";
import { db } from "../../../helpers/database.helper";

// models
import { userTable } from "./user.model";

export async function fetchUserRepository(options: { id: string }) {
  const query = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, options.id));

  return query[0];
}

export async function fetchOrCreateUserRepository(options: {
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}) {
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, options.email));

  if (!user.length) {
    const newUser = await db
      .insert(userTable)
      .values({
        email: options.email,
        firstName: options.first_name,
        lastName: options.last_name,
        avatarUrl: options.avatar_url,
      })
      .returning()
      .onConflictDoNothing();

    return newUser[0];
  }

  return user[0];
}

export async function updateUserRepository(options: {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}) {
  const query = await db
    .update(userTable)
    .set({
      firstName: options.first_name,
      lastName: options.last_name,
      avatarUrl: options.avatar_url,
    })
    .where(eq(userTable.id, options.id))
    .returning();

  return query[0];
}

export async function deleteUserRepository(options: { id: string }) {
  const query = await db
    .delete(userTable)
    .where(eq(userTable.id, options.id))
    .returning();

  return query[0];
}
