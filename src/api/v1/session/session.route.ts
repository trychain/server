// packages
import { Hono } from "hono";

// validators
import {
  fetchSessionValidator,
  fetchAllSessionsValidator,
  deleteSessionValidator,
} from "./session.validator";
import { authMiddlewareValidator } from "../auth/auth.validator";

// middlewares
import { authMiddlewareHandler } from "../auth/auth.middleware";

// factories
import {
  deleteSessionController,
  fetchAllSessionsController,
  fetchSessionController,
} from "./session.controller";

export const sessionRoute = new Hono();

sessionRoute.get(
  "/v1/session/current/",
  ...fetchSessionValidator,
  ...authMiddlewareValidator,
  authMiddlewareHandler({}),
  ...fetchSessionController,
);

sessionRoute.get(
  "/v1/session/",
  ...fetchAllSessionsValidator,
  ...authMiddlewareValidator,
  authMiddlewareHandler({}),
  ...fetchAllSessionsController,
);

sessionRoute.delete(
  "/v1/session/",
  ...deleteSessionValidator,
  ...authMiddlewareValidator,
  authMiddlewareHandler({}),
  ...deleteSessionController,
);

sessionRoute.delete(
  "/v1/session/:id",
  ...deleteSessionValidator,
  ...authMiddlewareValidator,
  authMiddlewareHandler({}),
  ...deleteSessionController,
);
