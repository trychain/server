// packages
import { Hono, MiddlewareHandler } from "hono";
import { serve } from "@hono/node-server";
import { HTTPException } from "hono/http-exception";

// helpers
import { logger } from "../helpers/winston";

export function createHonoApp(options: {
  middlewares?: MiddlewareHandler[];
  routes?: Hono[];
  port: number;
  hostname?: string;
  debug?: boolean;
}) {
  const app = new Hono();

  for (const middleware of options.middlewares || []) {
    app.use(middleware);
  }
  if (options.debug) {
    logger.info(`middlewares loaded: ${options.middlewares?.length || 0}`);
  }

  for (const route of options.routes || []) {
    app.route("/", route);
  }
  if (options.debug) {
    logger.info(`routes loaded: ${options.routes?.length || 0}`);
  }

  app.notFound(() => {
    throw new HTTPException(404, { message: "route not found" });
  });
  if (options.debug) {
    logger.info(`not found handler loaded`);
  }

  app.onError((error: Error | HTTPException, ctx) => {
    const dev =
      process.env.ENVIRONMENT === "development"
        ? {
            stack: error.stack || "No stack available",
            errorType: error.constructor.name,
          }
        : {};

    if (error instanceof HTTPException) {
      return ctx.json(
        {
          message: error.message,
          ...dev,
        },
        error.status,
      );
    }

    return ctx.json({
      message: error.message,
      ...dev,
    });
  });
  if (options.debug) {
    logger.info(`error handler loaded`);
  }

  serve({
    fetch: app.fetch,
    port: options.port,
    hostname: options.hostname || "localhost",
  });

  if (options.debug) {
    logger.info(
      `chain server app started at http://${options.hostname || "localhost"}:${options.port}`,
    );
  }

  return app;
}
