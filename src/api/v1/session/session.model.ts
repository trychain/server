// packages
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// models
import { userTable } from "../user/user.model.ts";

export const sessionTable = pgTable("session", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  user_id: uuid()
    .notNull()
    .references(() => userTable.id),
  ip: varchar().notNull(),
  country: varchar().notNull(),
  city: varchar().notNull(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});
