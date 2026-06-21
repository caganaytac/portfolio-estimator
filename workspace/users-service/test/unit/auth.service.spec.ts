import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import bcrypt from "bcrypt";
import { AuthService } from "../../src/services/auth.service";
import { AppError } from "../../src/utils/appError";
import { UserStatus, type User } from "../../src/models/user";

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    hashSync: jest.fn(() => "dummy-hash"),
    compare: jest.fn(),
    hash: jest.fn()
  }
}));

const compareMock = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>;
const hashMock = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;

function user(overrides: Partial<User> = {}): User {
  return {
    id: 42,
    publicId: "user-public-id",
    email: "person@example.com",
    passwordHash: "stored-hash",
    role: "user",
    status: UserStatus.ACTIVE,
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
    ...overrides
  };
}

function harness() {
  const personService = {
    createPerson: jest.fn<(...args: any[]) => Promise<any>>()
  };
  const corporateService = {
    createCorporate: jest.fn<(...args: any[]) => Promise<any>>()
  };
  const userService = {
    getUserByEmail: jest.fn<(...args: any[]) => Promise<any>>(),
    getUserByPublicId: jest.fn<(...args: any[]) => Promise<any>>(),
    getUserById: jest.fn<(...args: any[]) => Promise<any>>(),
    changePassword: jest.fn<(...args: any[]) => Promise<any>>()
  };
  const tokenService = {
    generateTokens: jest.fn(() => ({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      expiresIn: "15m"
    })),
    verifyRefreshToken: jest.fn<(...args: any[]) => any>()
  };
  const passwordPolicy = {
    validate: jest.fn()
  };

  const service = new AuthService(
    personService as any,
    corporateService as any,
    userService as any,
    tokenService as any,
    passwordPolicy as any
  );

  return {
    service,
    personService,
    corporateService,
    userService,
    tokenService,
    passwordPolicy
  };
}

async function expectAppError(
  promise: Promise<unknown>,
  statusCode: number,
  message: string
) {
  await expect(promise).rejects.toMatchObject({ statusCode, message });
}

describe("AuthService", () => {
  beforeEach(() => {
    compareMock.mockReset();
    hashMock.mockReset();
  });

  it("normalizes email and generates tokens after a valid login", async () => {
    const { service, userService, tokenService } = harness();
    userService.getUserByEmail.mockResolvedValue(user());
    compareMock.mockResolvedValue(true as never);

    const result = await service.login("  PERSON@Example.COM ", "Password1");

    expect(userService.getUserByEmail).toHaveBeenCalledWith("person@example.com");
    expect(compareMock).toHaveBeenCalledWith("Password1", "stored-hash");
    expect(tokenService.generateTokens).toHaveBeenCalledWith("user-public-id", "user");
    expect(result.accessToken).toBe("access-token");
  });

  it("performs a dummy comparison and returns the same error for an unknown email", async () => {
    const { service, userService, tokenService } = harness();
    userService.getUserByEmail.mockResolvedValue(null);
    compareMock.mockResolvedValue(false as never);

    await expectAppError(
      service.login("missing@example.com", "Password1"),
      401,
      "Invalid credentials"
    );

    expect(compareMock).toHaveBeenCalledWith("Password1", "dummy-hash");
    expect(tokenService.generateTokens).not.toHaveBeenCalled();
  });

  it("rejects an invalid password without generating tokens", async () => {
    const { service, userService, tokenService } = harness();
    userService.getUserByEmail.mockResolvedValue(user());
    compareMock.mockResolvedValue(false as never);

    await expectAppError(
      service.login("person@example.com", "WrongPassword1"),
      401,
      "Invalid credentials"
    );
    expect(tokenService.generateTokens).not.toHaveBeenCalled();
  });

  it("rejects inactive users even when the password is correct", async () => {
    const { service, userService } = harness();
    userService.getUserByEmail.mockResolvedValue(user({ status: UserStatus.LOCKED }));
    compareMock.mockResolvedValue(true as never);

    await expectAppError(
      service.login("person@example.com", "Password1"),
      403,
      "User is not active"
    );
  });

  it("rotates tokens only for an active user with a valid refresh token", async () => {
    const { service, userService, tokenService } = harness();
    tokenService.verifyRefreshToken.mockReturnValue({ sub: "user-public-id" });
    userService.getUserByPublicId.mockResolvedValue(user());

    const result = await service.refreshToken("valid-refresh-token");

    expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith("valid-refresh-token");
    expect(tokenService.generateTokens).toHaveBeenCalledWith("user-public-id", "user");
    expect(result.refreshToken).toBe("refresh-token");
  });

  it("rejects refresh tokens whose subject no longer exists", async () => {
    const { service, userService, tokenService } = harness();
    tokenService.verifyRefreshToken.mockReturnValue({ sub: "deleted-user" });
    userService.getUserByPublicId.mockResolvedValue(null);

    await expectAppError(
      service.refreshToken("validly-signed-token"),
      401,
      "Invalid refresh token"
    );
  });

  it("registers a person with normalized email, a hash, and a server-owned role", async () => {
    const { service, personService, userService, passwordPolicy, tokenService } = harness();
    userService.getUserByEmail.mockResolvedValue(null);
    hashMock.mockResolvedValue("new-hash" as never);
    personService.createPerson.mockResolvedValue({ userId: 42 });
    userService.getUserById.mockResolvedValue(user());

    await service.register({
      type: "person",
      email: "  PERSON@Example.COM ",
      password: "Password1",
      firstName: "Ada",
      lastName: "Lovelace",
      dateOfBirth: new Date("1990-01-01"),
      taxId: "TAX-1",
      taxResidenceCountry: "DE",
      riskClass: "B",
      investmentHorizon: 10
    });

    expect(passwordPolicy.validate).toHaveBeenCalledWith("Password1");
    expect(personService.createPerson).toHaveBeenCalledWith(expect.objectContaining({
      email: "person@example.com",
      passwordHash: "new-hash",
      role: "user"
    }));
    expect(tokenService.generateTokens).toHaveBeenCalledWith("user-public-id", "user");
  });

  it("does not hash or create a profile when the email is already registered", async () => {
    const { service, userService, personService } = harness();
    userService.getUserByEmail.mockResolvedValue(user());

    await expectAppError(
      service.register({
        type: "person",
        email: "person@example.com",
        password: "Password1",
        firstName: "Ada",
        lastName: "Lovelace",
        dateOfBirth: new Date("1990-01-01"),
        taxId: "TAX-1",
        taxResidenceCountry: "DE",
        riskClass: "B",
        investmentHorizon: 10
      }),
      409,
      "Email already registered"
    );

    expect(hashMock).not.toHaveBeenCalled();
    expect(personService.createPerson).not.toHaveBeenCalled();
  });

  it("validates and persists a changed password before rotating tokens", async () => {
    const { service, userService, passwordPolicy, tokenService } = harness();
    userService.getUserByPublicId.mockResolvedValue(user());
    compareMock.mockResolvedValue(true as never);
    hashMock.mockResolvedValue("changed-hash" as never);

    await service.changePassword({
      publicId: "user-public-id",
      currentPassword: "Password1",
      newPassword: "NewPassword2"
    });

    expect(passwordPolicy.validate).toHaveBeenCalledWith("NewPassword2");
    expect(userService.changePassword).toHaveBeenCalledWith(
      "user-public-id",
      "changed-hash"
    );
    expect(tokenService.generateTokens).toHaveBeenCalledWith("user-public-id", "user");
  });
});
