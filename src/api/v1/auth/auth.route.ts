// packages
import { Hono } from "hono";
import { validator } from "hono/validator";
import { type HttpBindings } from "@hono/node-server";

// factories
import { createAuthHandler, verifyAuthHandler } from "./auth.factory";

// validators
import { createAuthValidator, verifyAuthValidator } from "./auth.validator";

export const authRoute = new Hono();

authRoute.post("/v1/auth/", ...createAuthValidator, ...createAuthHandler);

authRoute.post("/v1/auth/:id", ...verifyAuthValidator, ...verifyAuthHandler);
