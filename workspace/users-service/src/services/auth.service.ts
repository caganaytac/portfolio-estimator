import bcrypt from "bcrypt";
import { TokenService } from "./token.service";
import { PasswordPolicyService } from "./password-policy.service";
import { AppError } from "../utils/appError";
import { env } from "../config/env";
import { UserStatus } from "../models/user";
import { UserRepository } from "../repositories/user.repository";
import { PersonService } from "./person.service";
import { CorporateService } from "./corporate.service";

interface RegisterPersonInput {
  type: "person";
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  taxId?: string;
  taxResidenceCountry?: string;
  riskClass?: string;
  investmentHorizon?: number;
}

interface RegisterCorporateInput {
  type: "corporate";
  email: string;
  password: string;
  corporateName: string;
  companyRegNo?: string;
  vatId?: string;
}
type RegisterInput = RegisterPersonInput | RegisterCorporateInput;

export class AuthService {
  constructor(
    private readonly personService: PersonService,
    private readonly corporateService: CorporateService,
    private readonly userRepo: UserRepository,
    private readonly tokenService: TokenService,
    private readonly passwordPolicy: PasswordPolicyService
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError(403, "User is not active");
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new AppError(401, "Invalid credentials");
    }

    return this.tokenService.generateTokens(user);
  }

  async refreshToken(publicId: string) {
    const user = await this.userRepo.findByPublicId(publicId);
    if (!user) throw new AppError(404, "User not found");
    return this.tokenService.generateTokens(user);
  }

  async changePassword(publicId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepo.findByPublicId(publicId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      throw new AppError(400, "Current password incorrect");
    }

    this.passwordPolicy.validate(newPassword);
    const hashed = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);
    await this.userRepo.update(user.id, {
      passwordHash: hashed,
      updatedAt: new Date(),
    });
  }

  async register(input: RegisterInput) {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, "Email already in use");
    }

    this.passwordPolicy.validate(input.password);

    /* let user;
    if (input.type === "person") {
      user = await this.personService.createPerson({
        email: input.email,
        password: input.password,
        role: "user",
        firstName: input.firstName,
        lastName: input.lastName,
        dateOfBirth: input.dateOfBirth,
        taxId: input.taxId,
        taxResidenceCountry: input.taxResidenceCountry,
        riskClass: input.riskClass,
        investmentHorizon: input.investmentHorizon,
      });
    } else {
      user = await this.corporateService.createCorporate({
        email: input.email,
        password: input.password,
        role: "user",
        corporateName: input.corporateName,
        companyRegNo: input.companyRegNo,
        vatId: input.vatId,
      });
    }

    return this.tokenService.generateTokens(user);
  } */
}
}
