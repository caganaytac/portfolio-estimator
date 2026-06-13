import { jest, describe, it, expect } from "@jest/globals";
import request from "supertest";
import { buildApp } from "../../src/app";

const userControllerMock = {
  listUsers: jest.fn((_req: unknown, res: any) =>
    res.json({ data: [], total: 0, page: 1, pageSize: 25 })
  ),
  createUser: jest.fn((_req: unknown, res: any) => res.status(201).json({})),
  getUser: jest.fn((_req: unknown, res: any) => res.json({})),
  updateUser: jest.fn((_req: unknown, res: any) => res.json({})),
  deleteUser: jest.fn((_req: unknown, res: any) => res.status(204).send()),
};

const authControllerMock = {
  login: jest.fn((_req: unknown, res: any) => res.json({ accessToken: "token" })),
  refresh: jest.fn((_req: unknown, res: any) => res.json({ accessToken: "token" })),
  changePassword: jest.fn((_req: unknown, res: any) => res.status(204).send()),
};

const app = buildApp({
  userController: userControllerMock as any,
  authController: authControllerMock as any,
});

describe("Health endpoints", () => {
  it("returns ok for live health", async () => {
    const response = await request(app).get("/health/live");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});

