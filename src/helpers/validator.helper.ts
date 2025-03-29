// packages
import { ZodSchema, z } from "zod";
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

export const body = (schema: any) => validate("json", z.object({ ...schema }));
export const header = (schema: any) =>
  validate("header", z.object({ ...schema }));
export const param = (schema: any) =>
  validate("param", z.object({ ...schema }));
export const query = (schema: any) =>
  validate("query", z.object({ ...schema }));
