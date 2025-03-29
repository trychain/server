// helpers
import { createHonoApp } from "./helpers/hono.helper";

// routes
import { authRoute } from "./api/v1/auth/auth.route";
import { userRoute } from "./api/v1/user/user.route";
import { sessionRoute } from "./api/v1/session/session.route";

createHonoApp({
  routes: [authRoute, userRoute, sessionRoute],
  port: 8000,
  debug: true,
});
