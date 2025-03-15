// helpers
import { createHonoApp } from "./helpers/hono.helper";

// routes
import { authRoute } from "./api/v1/auth/auth.route";

createHonoApp({
  routes: [authRoute],
  port: 8000,
});
