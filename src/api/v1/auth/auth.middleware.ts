// pacakges
import { createMiddleware } from "hono/factory";
import { verify as jwtVerify } from "hono/jwt";
import { HTTPException } from "hono/http-exception";

// repositories
import { fetchSessionRepository } from "./auth.repository";

export const authMiddlewareHandler = (options: { roles?: string[] }) =>
  createMiddleware(async (ctx, next) => {
    const authorization = ctx.req.header("authorization");
    if (!authorization) {
      throw new HTTPException(401, { message: "AUTH_REQUIRED" });
    }

    const [, token] = authorization.split(" ");
    const payload = await jwtVerify(
      token,
      process.env.JWT_SECRET!,
    ).catch(() => null);

    if (!payload) {
      throw new HTTPException(401, { message: "AUTH_REQUIRED" });
    }

    const session = await fetchSessionRepository({
      id: payload.sub as string,
    });

    if (!session) {
      throw new HTTPException(401, { message: "AUTH_SESSION_INVALID" });
    }

    for (const role of options.roles || []) {
      if (!session.user.roles?.includes(role)) {
        throw new HTTPException(403, { message: "AUTH_PERMISSION_DENIED" });
      }
    }

    ctx.set("session", session);
    await next();
  });
