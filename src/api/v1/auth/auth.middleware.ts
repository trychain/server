// pacakges
import { createFactory } from "hono/factory";
import { verify as jwtVerify } from "hono/jwt";
import { HTTPException } from "hono/http-exception";

// repositories
import { fetchSessionRepository } from "../session/session.repository";

export const authMiddleware = createFactory();

export const authMiddlewareHandler = (options: { roles?: string[] }) =>
  authMiddleware.createMiddleware(async (ctx, next) => {
    const { authorization } = ctx.req.valid("header" as never) as any;
    if (!authorization) {
      throw new HTTPException(401, { message: "AUTH_REQUIRED" });
    }

    const [, token] = authorization.split(" ");
    const payload = await jwtVerify(token, process.env.JWT_SECRET!).catch(
      () => null,
    );

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

    ctx.set("session" as any, session);
    await next();
  });
