// packages
import { Hono } from "hono";

// helpers
import { logger } from "../../src/helpers/winston.helper";

describe("winston helpers", () => {
  test("logger should be defined", () => {
    expect(logger).toBeDefined();
  });
});

