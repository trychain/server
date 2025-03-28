// packages
import { z } from "zod";

// helpers
import { header, body } from "../../../helpers/validator.helper";

export const authMiddlewareValidator = [
  header({
    authorization: z
      .string({ message: "AUTH_REQUIRED" })
      .startsWith("Bearer ", { message: "AUTH_REQUIRED" })
      .nonempty({ message: "AUTH_REQUIRED" }),
  }),
];

export const createAuthValidator = [
  body({
    email: z.string().email(),
  }),
];

export const verifyAuthValidator = [
  body({
    password: z
      .string()
      .min(6, { message: "INVALID_PASSWORD_LENGTH" })
      .max(6, { message: "INVALID_PASSWORD_LENGTH" }),
  }),
];
