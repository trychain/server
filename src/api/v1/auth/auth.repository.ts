// packages
import { eq, or } from "drizzle-orm";
import generateOtp from "otp-generator";

// helpers
import { db } from "../../../helpers/database.helper";

// models
import { authTable, sessionTable } from "./auth.model";
import { userTable } from "../user/user.model";

export async function fetchAuthRepository(options: {
  id?: string;
  email?: string;
}) {
  const query = await db
    .select({
      id: authTable.id,
      email: authTable.email,
      ip: authTable.ip,
      country: authTable.country,
      city: authTable.city,
      password: authTable.password,
    })
    .from(authTable)
    .where(
      or(eq(authTable.id, options.id!), eq(authTable.email, options.email!)),
    );

  return query[0];
}

export async function createAuthRepository(options: {
  email: string;
  ip: string;
  country: string;
  city: string;
}) {
  await db
    .insert(authTable)
    .values({
      email: options.email,
      ip: options.ip,
      country: options.country,
      city: options.city,
      password: generateOtp.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      }),
    })
    .returning()
    .onConflictDoNothing();

  const query = await fetchAuthRepository({ email: options.email });

  return query;
}

export async function deleteAuthRepository(options: { id: string }) {
  const query = await db
    .delete(authTable)
    .where(eq(authTable.id, options.id))
    .returning();

  return query[0];
}

export async function createSessionRepository(options: {
  userId: string;
  ip: string;
  country: string;
  city: string;
}) {
  const query = await db
    .insert(sessionTable)
    .values({
      userId: options.userId,
      ip: options.ip,
      country: options.country,
      city: options.city,
    })
    .returning()
    .onConflictDoNothing();

  return query[0];
}

export async function fetchSessionRepository(options: { id?: string }) {
  const query = await db
    .select({
      id: sessionTable.id,
      ip: sessionTable.ip,
      country: sessionTable.country,
      city: sessionTable.city,
      user: {
        id: userTable.id,
        email: userTable.email,
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        avatarUrl: userTable.avatarUrl,
        roles: userTable.roles,
      },
    })
    .from(sessionTable)
    .where(eq(sessionTable.id, options.id!))
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id));

  return query[0];
}
