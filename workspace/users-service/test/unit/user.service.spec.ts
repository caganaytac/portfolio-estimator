import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { UserService } from "../../src/services/user.service";
import { UserRepository } from "../../src/repositories/user.repository";
import { UserAuditRepository } from "../../src/repositories/userAudit.repository";
import { PasswordPolicyService } from "../../src/services/password-policy.service";
import { CreateUserDto } from "../../src/dtos/create-user.dto";
import { UpdateUserDto } from "../../src/dtos/update-user.dto";
import { User, UserStatus } from "../../src/models/user.entity";

const createUser = (): User => ({
  id: "user-1",
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  password: "hashed",
  tenantId: "tenant-1",
  role: "user",
  status: UserStatus.ACTIVE,
  failedLoginAttempts: 0,
  lockedAt: null,
  lastLoginAt: null,
  passwordUpdatedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("UserService", () => {
  const repo = {
    create: jest.fn<User, [Partial<User>]>(),
    save: jest.fn<Promise<User>, [User]>(),
    findByEmail: jest.fn<Promise<User | null>, [string]>(),
    findById: jest.fn<Promise<User | null>, [string]>(),
    findPaginated: jest.fn<Promise<[User[], number]>, [number, number]>(),
    update: jest.fn<Promise<User | null>, [string, Partial<User>]>(),
    delete: jest.fn<Promise<void>, [string]>(),
  } as unknown as jest.Mocked<UserRepository>;
  const auditRepo = {
    record: jest.fn<Promise<void>, [string, Record<string, unknown>]>(),
  } as unknown as jest.Mocked<UserAuditRepository>;
  const passwordPolicy = {
    validate: jest.fn<void, [string]>(),
  } as unknown as jest.Mocked<PasswordPolicyService>;

  const service = new UserService(repo, auditRepo, passwordPolicy);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("creates a user when email unused", async () => {
    const dto = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "Password123",
      tenantId: "tenant-1",
      role: "user",
    } satisfies CreateUserDto;
    const saved = createUser();
    (repo.findByEmail as jest.Mock).mockResolvedValue(null);
    (repo.create as jest.Mock).mockReturnValue(saved);
    (repo.save as jest.Mock).mockResolvedValue(saved);

    const result = await service.createUser(dto);

    expect(passwordPolicy.validate).toHaveBeenCalledWith(dto.password);
    expect(repo.save).toHaveBeenCalled();
    expect(result.id).toEqual(saved.id);
    expect(auditRepo.record).toHaveBeenCalledWith("user.created", expect.any(Object));
  });

  it("lists users with pagination", async () => {
    const user = createUser();
    (repo.findPaginated as jest.Mock).mockResolvedValue([[user], 1]);

    const result = await service.listUsers(1, 10);

    expect(repo.findPaginated).toHaveBeenCalledWith(0, 10);
    expect(result.total).toBe(1);
    expect(result.data[0].id).toBe(user.id);
  });

  it("updates user and hashes password when provided", async () => {
    const user = createUser();
    (repo.findById as jest.Mock).mockResolvedValue(user);
    (repo.update as jest.Mock).mockResolvedValue({ ...user, firstName: "Updated" });

    const dto: UpdateUserDto = { firstName: "Updated" };
    const updated = await service.updateUser(user.id, dto);

    expect(repo.update).toHaveBeenCalledWith(user.id, expect.objectContaining({ firstName: "Updated" }));
    expect(updated?.firstName).toBe("Updated");
    expect(auditRepo.record).toHaveBeenCalledWith("user.updated", expect.any(Object));
  });

  it("deletes user and records audit log", async () => {
    const user = createUser();
    (repo.findById as jest.Mock).mockResolvedValue(user);

    await service.deleteUser(user.id);

    expect(repo.delete).toHaveBeenCalledWith(user.id);
    expect(auditRepo.record).toHaveBeenCalledWith("user.deleted", { userId: user.id });
  });
});

