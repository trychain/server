// packages
import { Hono } from "hono";
import { z } from "zod";

// helpers
import {
  validate,
  body,
  header,
  param,
} from "../../src/helpers/validator.helper";

describe("validator helpers", () => {
  const schema = z.object({
    test: z.string().uuid(),
  });

  test("validate(x, y) should build validation schema", () => {
    const validateJson = validate("json", schema);

    expect(validateJson).toBeDefined();
  });

  test("body(x) shouldbuild body validation schema", () => {
    const validateJson = body(schema);

    expect(validateJson).toBeDefined();
  });

  test("header(x) should build headers validation schema", () => {
    const validateHeader = header(schema);

    expect(validateHeader).toBeDefined();
  });

  test("param(x) should build headers validation schema", () => {
    const validateParam = param(schema);

    expect(validateParam).toBeDefined();
  });
});
