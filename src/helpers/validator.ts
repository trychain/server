// packages
import { ZodSchema } from "zod";
import type { ValidationTargets } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";

export const validate = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      throw new HTTPException(400, { message: result.error.errors[0].message });
    }
  });

export const body = <T extends ZodSchema>(schema: T) =>
  validate("json", schema);

export const header = <T extends ZodSchema>(schema: T) =>
  validate("header", schema);

export const param = <T extends ZodSchema>(schema: T) =>
  validate("param", schema);
