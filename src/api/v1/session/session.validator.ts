// packages
import { z } from "zod";

// helpers
import { param, query } from "../../../helpers/validator.helper";

export const fetchSessionValidator = [];

export const fetchAllSessionsValidator = [
  query({
    limit: z.coerce.number().min(1).max(12).default(10),
    page: z.coerce.number().min(1).max(100).default(1),
  }),
];

export const deleteSessionValidator = [
  param({
    id: z.string().uuid().optional(),
  }),
];
