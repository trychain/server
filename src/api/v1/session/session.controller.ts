// packages
import { createFactory } from "hono/factory";

// repositories
import {
  fetchSessionRepository,
  fetchAllSessionsRepository,
  deleteSessionRepository,
} from "./session.repository";

export const sessionFactory = createFactory();

export const fetchSessionController = sessionFactory.createHandlers(
  async (ctx) => {
    const session = ctx.get("session" as any);

    return ctx.json(
      {
        message: "SESSION_FETCHED",
        entry: { session: session },
      },
      200,
    );
  },
);

export const fetchAllSessionsController = sessionFactory.createHandlers(
  async (ctx) => {
    const { page, limit } = ctx.req.valid("query" as never);
    const session = ctx.get("session" as any);

    const sessions = await fetchAllSessionsRepository({
      userId: session.user.id,
      limit: limit as number,
      page: page as number,
    });

    return ctx.json(
      {
        message: "SESSIONS_FETCHED",
        entry: { page: page, limit: limit, sessions: sessions },
      },
      200,
    );
  },
);

export const deleteSessionController = sessionFactory.createHandlers(
  async (ctx) => {
    const { id } = ctx.req.valid("param" as never);
    const session = ctx.get("session" as any);

    await deleteSessionRepository({
      id: id || session.id,
      userId: session.user.id,
    });

    return ctx.json(
      {
        message: "SESSION_DELETED",
      },
      200,
    );
  },
);
