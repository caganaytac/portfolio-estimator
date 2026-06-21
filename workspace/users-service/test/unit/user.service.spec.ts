import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import bcrypt from "bcrypt";
import { UserService } from "../../src/services/user.service";
import { UserStatus, type User } from "../../src/models/user";

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    hash: jest.fn()
  }
}));

const hashMock = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;

function user(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    publicId: "public-1",
    email: "person@example.com",
    passwordHash: "hash",
    role: "user",
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}

function harness() {
  const repo = {
    findByEmail: jest.fn<(...args: any[]) => Promise<any>>(),
    findById: jest.fn<(...args: any[]) => Promise<any>>(),
    findByPublicId: jest.fn<(...args: any[]) => Promise<any>>(),
    findPaginated: jest.fn<(...args: any[]) => Promise<any>>(),
    create: jest.fn((value: any) => value),
    save: jest.fn<(...args: any[]) => Promise<any>>(),
    updateByPublicId: jest.fn<(...args: any[]) => Promise<any>>(),
    deleteByPublicId: jest.fn<(...args: any[]) => Promise<any>>()
  };
  const passwordPolicy = { validate: jest.fn() };
  const service = new UserService(repo as any, passwordPolicy as any);
  return { service, repo, passwordPolicy };
}

describe("UserService", () => {
  beforeEach(() => hashMock.mockReset());

  it("creates a user when the email is available", async () => {
    const { service, repo } = harness();
    const saved = user();
    repo.findByEmail.mockResolvedValue(null);
    repo.save.mockResolvedValue(saved);

    const result = await service.createUser({
      email: saved.email,
      passwordHash: saved.passwordHash,
      role: "user"
    });

    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ email: saved.email }));
    expect(result).toBe(saved);
  });

  it("rejects duplicate email creation", async () => {
    const { service, repo } = harness();
    repo.findByEmail.mockResolvedValue(user());

    await expect(service.createUser({
      email: "person@example.com",
      passwordHash: "hash",
      role: "user"
    })).rejects.toMatchObject({ statusCode: 409, message: "Email already in use" });
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("calculates pagination offsets", async () => {
    const { service, repo } = harness();
    repo.findPaginated.mockResolvedValue([[user()], 1]);

    const page = await service.listUsers(3, 10);

    expect(repo.findPaginated).toHaveBeenCalledWith(20, 10);
    expect(page).toMatchObject({ total: 1, page: 3, pageSize: 10 });
  });

  it("validates and hashes a password update", async () => {
    const { service, repo, passwordPolicy } = harness();
    repo.findByPublicId.mockResolvedValue(user());
    repo.updateByPublicId.mockResolvedValue(user({ passwordHash: "new-hash" }));
    hashMock.mockResolvedValue("new-hash" as never);

    await service.updateUser("public-1", { password: "NewPassword2" });

    expect(passwordPolicy.validate).toHaveBeenCalledWith("NewPassword2");
    expect(repo.updateByPublicId).toHaveBeenCalledWith(
      "public-1",
      expect.objectContaining({ passwordHash: "new-hash" })
    );
  });

  it("rejects an email update owned by another user", async () => {
    const { service, repo } = harness();
    repo.findByPublicId.mockResolvedValue(user());
    repo.findByEmail.mockResolvedValue(user({ publicId: "public-2" }));

    await expect(service.updateUser("public-1", {
      email: "other@example.com"
    })).rejects.toMatchObject({ statusCode: 409, message: "Email already in use" });
    expect(repo.updateByPublicId).not.toHaveBeenCalled();
  });

  it("does not delete a missing user", async () => {
    const { service, repo } = harness();
    repo.findByPublicId.mockResolvedValue(null);

    await expect(service.deleteUser("missing")).rejects.toMatchObject({
      statusCode: 404,
      message: "User not found"
    });
    expect(repo.deleteByPublicId).not.toHaveBeenCalled();
  });
});
