// packages
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

// models
import { userTable } from "../user/user.model";

export const authTable = pgTable("auth", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  email: varchar("email").unique().notNull(),
  ip: varchar("ip").notNull(),
  country: varchar("country").notNull(),
  city: varchar("city").notNull(),
  password: varchar("password"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessionTable = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  ip: varchar("ip").notNull(),
  country: varchar("country").notNull(),
  city: varchar("city").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
