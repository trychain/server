// packages
import { drizzle } from "drizzle-orm/node-postgres";

export function buildDatabaseUri() {
  const DATABASE_USERNAME = process.env.DATABASE_USERNAME;
  const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
  const DATABASE_HOST = process.env.DATABASE_HOST;
  const DATABASE_PORT = process.env.DATABASE_PORT;
  const DATABASE_NAME = process.env.DATABASE_NAME;

  return `postgresql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;
}

export const db = drizzle(buildDatabaseUri());
