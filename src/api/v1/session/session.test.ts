// helpers
import { createHonoApp } from "../../../helpers/hono.helper";

// routes
import { sessionRoute } from "./session.route";

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

describe("session api", () => {
  const app = createHonoApp({
    routes: [sessionRoute],
    port: 9001,
    hostname: "localhost",
    debug: false,
  });
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ODYyYmU3Yy01ZTgwLTRhMzQtODkxZC0yMGU0YjVlZmYxNmIiLCJleHAiOjE3NDQyNTMwOTh9.Boj4rXiwq5d61Fut09x742N5TOhSz68vRiWN3FYzjLU";

  test("fetch current session", async () => {
    const response = await app.request(
      "http://localhost:9000/v1/session/current/",
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      },
      env,
    );

    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toHaveProperty("message");

    expect(data.entry.session).toHaveProperty("id");
    expect(data.entry.session).toHaveProperty("ip");
    expect(data.entry.session).toHaveProperty("country");
    expect(data.entry.session).toHaveProperty("city");
    expect(data.entry.session).toHaveProperty("user");

    expect(data.entry.session.user).toHaveProperty("id");
    expect(data.entry.session.user).toHaveProperty("email");
    expect(data.entry.session.user).toHaveProperty("firstName");
    expect(data.entry.session.user).toHaveProperty("lastName");
    expect(data.entry.session.user).toHaveProperty("avatarUrl");
    expect(data.entry.session.user).toHaveProperty("roles");
  });

  test("fetch all sessions", async () => {
    const response = await app.request(
      "http://localhost:9000/v1/session/",
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      },
      env,
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("message");

    expect(typeof data.entry.sessions).toEqual("object");

    if (data.entry.sessions.length) {
      expect(data.entry.sessions[0]).toHaveProperty("id");
      expect(data.entry.sessions[0]).toHaveProperty("ip");
      expect(data.entry.sessions[0]).toHaveProperty("country");
      expect(data.entry.sessions[0]).toHaveProperty("city");
      expect(data.entry.sessions[0]).toHaveProperty("user");
    }
  });
});
