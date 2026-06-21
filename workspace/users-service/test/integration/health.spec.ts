import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import { buildHttpTestHarness } from "../support/http-test-harness";

describe("users-service health and fallback routes", () => {
  it("reports liveness without touching a dependency", async () => {
    const { app, authService } = buildHttpTestHarness();

    const response = await request(app).get("/health/live");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "users-service"
    });
    expect(authService.login).not.toHaveBeenCalled();
  });

  it("returns a useful 404 response for unknown routes", async () => {
    const { app } = buildHttpTestHarness();

    const response = await request(app).get("/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Route GET /does-not-exist not found");
  });
});
