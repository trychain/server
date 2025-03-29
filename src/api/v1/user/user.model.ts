// packages
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  avatarUrl: varchar("avatar_url"),
  roles: varchar("roles").array().default([]),
  settingsDarkMode: boolean("settings_dark_mode").default(false),
  settingsMaskCode: boolean("settings_mask_code").default(false),
  settingsEasyCopy: boolean("settings_easy_copy").default(false),
  pin_lock: uuid("pin_lock").references(() => pinTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pinTable = pgTable("pin_lock", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  pin: varchar("pin").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
