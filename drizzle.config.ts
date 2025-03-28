// packages
import { defineConfig } from "drizzle-kit";

// helpers
import { buildDatabaseUri } from "./src/helpers/database.helper";

export default defineConfig({
  schema: "./src/api/**/*.model.ts",
  out: "./.drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: buildDatabaseUri(),
  },
});
