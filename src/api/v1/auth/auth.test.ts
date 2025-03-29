  // helpers
import { createHonoApp } from "../../../helpers/hono.helper";

// repository
import { fetchAuthRepository } from "./auth.repository";

// routes
import { authRoute } from "./auth.route";

const env = {
  server: {
    incoming: {
      socket: {
        remoteAddress: "127.0.0.1",
        remotePort: 8080,
        remoteFamily: "IPv4",
      },
    },
  },
};

describe("authentication/authorization api", () => {
  const app = createHonoApp({
    routes: [authRoute],
    port: 9000,
    hostname: "localhost",
    debug: false,
  });

  test("create new authentication ticket", async () => {
    const response = await app.request(
      "http://localhost:9000/v1/auth/",
      {
        method: "POST",
        body: JSON.stringify({ email: "john.deo@trychain.com" }),
        headers: {
          "content-type": "application/json",
        },
      },
      env,
    );

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty("message");
    expect(data.entry).toHaveProperty("id");
    expect(data.entry).toHaveProperty("email");
    expect(data.entry).toHaveProperty("country");
    expect(data.entry).toHaveProperty("city");
  });

  test("verify authentication ticket", async () => {
    const auth = await fetchAuthRepository({ email: "john.deo@trychain.com" });
    const response = await app.request(
      `http://localhost:9000/v1/auth/${auth.id}`,
      {
        method: "POST",
        body: JSON.stringify({ password: auth.password }),
        headers: {
          "content-type": "application/json",
        },
      },
      env,
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("message");
  });
});
