// packages
import { and, eq, or } from "drizzle-orm";

// helpers
import { db } from "../../../helpers/database.helper";

// models
import { sessionModel } from "./session.model";
import { userTable } from "../user/user.model";

export async function createSessionRepository(options: {
  userId: string;
  ip: string;
  country: string;
  city: string;
}) {
  const query = await db
    .insert(sessionModel)
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

export async function fetchAllSessionsRepository(options: {
  userId: string;
  page: number;
  limit: number;
}) {
  const query = await db
    .select({
      id: sessionModel.id,
      ip: sessionModel.ip,
      country: sessionModel.country,
      city: sessionModel.city,
      user: {
        id: userTable.id,
        email: userTable.email,
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        avatarUrl: userTable.avatarUrl,
        roles: userTable.roles,
      },
    })
    .from(sessionModel)
    .innerJoin(userTable, eq(sessionModel.userId, userTable.id))
    .where(eq(sessionModel.userId, options.userId))
    .limit(options.limit)
    .offset((options.page - 1) * options.limit);

  return query;
}

export async function fetchSessionRepository(options: {
  id?: string;
  userId?: string;
}) {
  const query = await db
    .select({
      id: sessionModel.id,
      ip: sessionModel.ip,
      country: sessionModel.country,
      city: sessionModel.city,
      user: {
        id: userTable.id,
        email: userTable.email,
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        avatarUrl: userTable.avatarUrl,
        roles: userTable.roles,
      },
    })
    .from(sessionModel)
    .where(
      or(
        eq(sessionModel.id, options.id!),
        eq(sessionModel.userId, options.userId!),
      ),
    )
    .innerJoin(userTable, eq(sessionModel.userId, userTable.id));

  return query[0];
}

export async function deleteSessionRepository(options: {
  id: string;
  userId: string;
}) {
  const query = await db
    .delete(sessionModel)
    .where(
      and(
        eq(sessionModel.id, options.id),
        eq(sessionModel.userId, options.userId),
      ),
    );

  return query[0];
}
