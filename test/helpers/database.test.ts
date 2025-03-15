// packages
import { Hono } from "hono";

// helpers
import { buildDatabaseUri, db } from "../../src/helpers/database.helper";

describe("hono helpers", () => {
  test("buildDatabaseUri() should build database uri", () => {
    const uri = buildDatabaseUri();
    expect(uri).toBeDefined();
  });

  test("db.$client should be defined", () => {
    expect(db.$client).toBeDefined();
  });
});
