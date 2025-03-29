// packages
import { Hono } from "hono";

// factories
import { createAuthController, verifyAuthController } from "./auth.controller";

// validators
import { createAuthValidator, verifyAuthValidator } from "./auth.validator";

export const authRoute = new Hono();

authRoute.post("/v1/auth/", ...createAuthValidator, ...createAuthController);

authRoute.post("/v1/auth/:id", ...verifyAuthValidator, ...verifyAuthController);
