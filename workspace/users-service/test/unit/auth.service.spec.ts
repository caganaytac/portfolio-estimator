import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import bcrypt from "bcrypt";
import { AuthService } from "../../src/services/auth.service";
import { UserRepository } from "../../src/repositories/user.repository";
import { UserAuditRepository } from "../../src/repositories/userAudit.repository";
import { TokenService } from "../../src/services/token.service";
import { PasswordPolicyService } from "../../src/services/password-policy.service";
import { User, UserStatus } from "../../src/models/user.entity";
import { AppError } from "../../src/utils/appError";

const user: User = {
  id: "user-1",
  email: "enterprise@example.com",
  firstName: "Enterprise",
  lastName: "User",
  password: "$2b$10$abcdefgh",
  tenantId: "tenant-1",
  role: "user",
  status: UserStatus.ACTIVE,
  failedLoginAttempts: 0,
  lockedAt: null,
  lastLoginAt: null,
  passwordUpdatedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("AuthService", () => {
  const repo = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<UserRepository>;
  const auditRepo = { record: jest.fn() } as unknown as jest.Mocked<UserAuditRepository>;
  const tokenService = { generateTokens: jest.fn(() => ({ accessToken: "token", refreshToken: "refresh", expiresIn: "15m" })) } as unknown as jest.Mocked<TokenService>;
  const passwordPolicy = { validate: jest.fn() } as unknown as jest.Mocked<PasswordPolicyService>;

  const service = new AuthService(repo, auditRepo, tokenService, passwordPolicy);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);
    (tokenService.generateTokens as jest.Mock).mockReturnValue({
      accessToken: "token",
      refreshToken: "refresh",
      expiresIn: "15m",
    });
  });

  it("issues tokens on successful login", async () => {
    (repo.findByEmail as jest.Mock).mockResolvedValue(user as never);
    (repo.update as jest.Mock).mockResolvedValue(user as never);

    const tokens = await service.login(user.email, "Password123");

    expect(repo.update).toHaveBeenCalledWith(user.id, expect.objectContaining({ failedLoginAttempts: 0 }));
    expect(tokens.accessToken).toBe("token");
    expect(auditRepo.record).toHaveBeenCalledWith("user.login", expect.any(Object));
  });

  it("throws when user not found", async () => {
    (repo.findByEmail as jest.Mock).mockResolvedValue(null as never);
    await expect(service.login("missing@example.com", "x")).rejects.toBeInstanceOf(AppError);
  });
});

