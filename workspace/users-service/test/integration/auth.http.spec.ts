import { describe, expect, it, jest } from "@jest/globals";
import request from "supertest";
import { AppError } from "../../src/utils/appError";
import { buildHttpTestHarness } from "../support/http-test-harness";

const tokens = {
  accessToken: "access-token",
  refreshToken: "refresh-token",
  expiresIn: "15m"
};

describe("authentication HTTP API", () => {
  it("validates and forwards a login request", async () => {
    const { app, authService } = buildHttpTestHarness();
    authService.login.mockResolvedValue(tokens);

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "person@example.com",
        password: "Password1"
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(tokens);
    expect(authService.login).toHaveBeenCalledWith(
      "person@example.com",
      "Password1"
    );
  });

  it("rejects malformed login payloads before calling the service", async () => {
    const { app, authService } = buildHttpTestHarness();

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "not-an-email" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ property: "email" }),
      expect.objectContaining({ property: "password" })
    ]));
    expect(authService.login).not.toHaveBeenCalled();
  });

  it("rejects non-whitelisted login fields", async () => {
    const { app, authService } = buildHttpTestHarness();

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "person@example.com",
        password: "Password1",
        role: "admin"
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ property: "role" })
    ]));
    expect(authService.login).not.toHaveBeenCalled();
  });

  it("uses a refresh token rather than a user identifier", async () => {
    const { app, authService } = buildHttpTestHarness();
    authService.refreshToken.mockResolvedValue(tokens);

    const response = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: "signed-refresh-token" });

    expect(response.status).toBe(200);
    expect(authService.refreshToken).toHaveBeenCalledWith("signed-refresh-token");
  });

  it("rejects the obsolete userId refresh payload", async () => {
    const { app, authService } = buildHttpTestHarness();

    const response = await request(app)
      .post("/auth/refresh")
      .send({ userId: "public-user-id" });

    expect(response.status).toBe(400);
    expect(authService.refreshToken).not.toHaveBeenCalled();
  });

  it("transforms and forwards a valid person registration", async () => {
    const { app, authService } = buildHttpTestHarness();
    authService.register.mockResolvedValue(tokens);

    const response = await request(app)
      .post("/auth/register/person")
      .send({
        email: "person@example.com",
        password: "Password1",
        firstName: "Ada",
        lastName: "Lovelace",
        dateOfBirth: "1990-01-01",
        taxId: "TAX-1",
        taxResidenceCountry: "DE",
        riskClass: "B",
        investmentHorizon: 10
      });

    expect(response.status).toBe(201);
    expect(authService.register).toHaveBeenCalledWith(expect.objectContaining({
      type: "person",
      dateOfBirth: expect.any(Date)
    }));
  });

  it("maps application errors to their HTTP status", async () => {
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    const { app, authService } = buildHttpTestHarness();
    authService.login.mockRejectedValue(new AppError(401, "Invalid credentials"));

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "person@example.com",
        password: "WrongPassword1"
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });
});
