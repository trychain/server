// packages
import { Hono } from "hono";

// helpers
import { createHonoApp } from "../../src/helpers/hono.helper";

describe("hono helpers", () => {
  it("createHonoApp() should create a hono app", async () => {
    const route = new Hono().get("/", (ctx) => ctx.text("Hello, World"));
    const app = createHonoApp({
      routes: [route],
      port: 9001,
      hostname: "localhost",
      debug: false,
    });

    const response = await app.request("http://localhost:9000/", {
      method: "GET",
    });
    const data = await response.text();

    expect(response.status).toBe(200);
    expect(data).toBe("Hello, World");
  });
});
