// packages
import lodash from "lodash";
import { createFactory } from "hono/factory";
import { getConnInfo } from "@hono/node-server/conninfo";
import { sign as jwtSign } from "hono/jwt";
import { HTTPException } from "hono/http-exception";

// helpers
import { getGeoDetails, sendAuthEmail } from "./auth.helpers";

// repositories
import {
  createAuthRepository,
  deleteAuthRepository,
  fetchAuthRepository,
} from "./auth.repository";
import { fetchOrCreateUserRepository } from "../user/user.repository";
import { createSessionRepository } from "../session/session.repository";

export const authFactory = createFactory();

export const createAuthController = authFactory.createHandlers(async (ctx) => {
  const { email } = ctx.req.valid("json" as never);
  const connInfo = getConnInfo(ctx);

  const geoDetails = getGeoDetails(connInfo.remote.address!);
  const sendEmail = await sendAuthEmail();

  if (!sendEmail) {
    throw new HTTPException(400, { message: "AUTH_FAILED_TO_SEND_EMAIL" });
  }

  const auth = await createAuthRepository({
    email: email,
    ip: connInfo.remote.address!,
    country: geoDetails.country,
    city: geoDetails.city,
  });

  if (!auth) {
    throw new HTTPException(400, { message: "AUTH_FAILED_TO_CREATE_TICKET" });
  }

  return ctx.json(
    {
      message: "AUTH_CREATED",
      entry: lodash.pick(auth, ["id", "email", "ip", "country", "city"]),
    },
    201,
  );
});

export const verifyAuthController = authFactory.createHandlers(async (ctx) => {
  const { id } = ctx.req.param<any>();
  const { password } = await ctx.req.json<{ password: string }>();

  const connInfo = getConnInfo(ctx);

  const geoDetails = getGeoDetails(connInfo.remote.address!);
  const auth = await fetchAuthRepository({ id: id });

  if (
    !auth ||
    auth.ip !== connInfo.remote.address ||
    auth.country !== geoDetails.country ||
    auth.city !== geoDetails.city ||
    auth.password !== password
  ) {
    throw new HTTPException(400, { message: "AUTH_FAILED_TO_VERIFY" });
  }

  await deleteAuthRepository({ id: id });

  const user = await fetchOrCreateUserRepository({ email: auth.email });
  const session = await createSessionRepository({
    userId: user.id,
    ip: auth.ip,
    country: auth.country,
    city: auth.city,
  });

  const token = await jwtSign(
    {
      sub: session.id,
      exp:
        Math.floor(Date.now() / 1000) + parseInt(process.env.JWT_EXPIRATION!),
    },
    process.env.JWT_SECRET!,
  );

  return ctx.json({
    message: "AUTH_VERIFIED",
    entry: lodash.merge(session, { token: token }),
  });
});
