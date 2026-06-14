import bcrypt from "bcrypt";
import { AppError } from "../utils/appError";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../models/user";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { env } from "../config/env";
import { PasswordPolicyService } from "./password-policy.service";
import { BaseService } from "./base.service";

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
}

export class UserService extends BaseService<User, CreateUserDto, UpdateUserDto> {
  
  constructor(private readonly userRepo: UserRepository,private readonly passwordPolicy: PasswordPolicyService) 
  {
    super(userRepo);}
  

  async createUser(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError(409, "Email already in use");
    }

    const user = this.userRepo.create(dto);
    const saved = await this.userRepo.save(user);
    return saved;
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepo.findById(id);
  }
  
  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async getUserByPublicId(publicId: string): Promise<User | null> {
    return this.userRepo.findByPublicId(publicId);
  }

  async listUsers(page = 1, pageSize = 25): Promise<PaginatedUsers> {
    const skip = (page - 1) * pageSize;
    const [data, total] = await this.userRepo.findPaginated(skip, pageSize);
    return { data, total, page, pageSize };
  }

  async changePassword(publicId: string, passwordHash: string) {
    await this.userRepo.updateByPublicId(publicId, { passwordHash, updatedAt: new Date() });
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findByPublicId(id);
    if (!user) throw new AppError(404, "User not found");

    if (dto.email && dto.email !== user.email) {
      const exists = await this.userRepo.findByEmail(dto.email);
      if (exists) throw new AppError(409, "Email already in use");
    }

    const payload: Partial<User> = { ...dto };
    if (dto.password) {
      this.passwordPolicy.validate(dto.password);
      payload.passwordHash = await bcrypt.hash(dto.password, env.BCRYPT_ROUNDS);
      payload.updatedAt = new Date();
    }

    const updated = await this.userRepo.updateByPublicId(id, payload);
    if (!updated) throw new AppError(404, "User not found");

    return updated;
  }

  async deleteUser(id: string) {
    const user = await this.userRepo.findByPublicId(id);
    if (!user) throw new AppError(404, "User not found");
    await this.userRepo.deleteByPublicId(id);
  }
}
