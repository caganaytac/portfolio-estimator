import bcrypt from "bcrypt";
import { TokenService } from "./token.service";
import { PasswordPolicyService } from "./password-policy.service";
import { AppError } from "../utils/appError";
import { env } from "../config/env";
import { UserStatus } from "../models/user";
import { PersonService } from "./person.service";
import { CorporateService } from "./corporate.service";
import { UserService } from "./user.service";
import { PersonRegisterDTO }  from "../dtos/person-register.dto";
import { CorporateRegisterDTO } from "../dtos/corporate-register.dto";
import { ChangePasswordDto } from "../dtos/change-password.dto";

type RegisterInput =
  | (PersonRegisterDTO & { type: "person" })
  | (CorporateRegisterDTO & { type: "corporate" });

const DUMMY_HASH = bcrypt.hashSync("timing-attack-mitigation", env.BCRYPT_ROUNDS);

export class AuthService {
  constructor(
    private readonly personService: PersonService,
    private readonly corporateService: CorporateService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly passwordPolicy: PasswordPolicyService
  ) {}

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userService.getUserByEmail(normalizedEmail);

    if (!user) {
      //With or without line 35
      //both cases return the exact same error message ("Invalid credentials"), 
      // so on the surface they look identical. But an attacker measuring how long 
      // the response takes to come back can tell the difference: a fast 401 means "that email isn't registered,"
      // a slow 401 means "that email exists, but the password was wrong."
      // a slow 401 means "that email exists, but the password was wrong."
      await bcrypt.compare(password, DUMMY_HASH);
      throw new AppError(401, "Invalid credentials");
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw new AppError(401, "Invalid credentials");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError(403, "User is not active");
    }

    return this.tokenService.generateTokens(user.publicId, user.role);
  }

  async refreshToken(refreshToken: string) {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);

    const user = await this.userService.getUserByPublicId(payload.sub);
    if (!user) {
      throw new AppError(401, "Invalid refresh token");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError(403, "User is not active");
    }

    return this.tokenService.generateTokens(user.publicId, user.role);
  }

  async changePassword(changePasswordDto:  ChangePasswordDto) {
    const user = await this.userService.getUserByPublicId(changePasswordDto.publicId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    const matches = await bcrypt.compare(changePasswordDto.currentPassword, user.passwordHash);
    if (!matches) {
      throw new AppError(400, "Current password incorrect");
    }

    this.passwordPolicy.validate(changePasswordDto.newPassword);
    const hashed = await bcrypt.hash(changePasswordDto.newPassword, env.BCRYPT_ROUNDS);

    await this.userService.changePassword(user.publicId, hashed);
    return this.tokenService.generateTokens(user.publicId, user.role);
  }

  async register(input: RegisterInput) {
    const normalizedEmail = input.email.trim().toLowerCase();

    const existing = await this.userService.getUserByEmail(normalizedEmail);
    if (existing) {
      throw new AppError(409, "Email already registered");
    }

    this.passwordPolicy.validate(input.password);
    const hashedPassword = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);

    let user;
    if (input.type === "person") {
      user = await this.personService.createPerson({
        email: normalizedEmail,
        passwordHash: hashedPassword,
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
        email: normalizedEmail,
        passwordHash: hashedPassword,
        role: "user",
        corporateName: input.corporateName,
        companyRegNo: input.companyRegNo,
        vatId: input.vatId,
      });
    }

    const generatedUser = await this.userService.getUserById(user.userId);
    if (!generatedUser) {
      throw new AppError(500, "User creation failed");
    }

    return this.tokenService.generateTokens(generatedUser.publicId, generatedUser.role);
  }
}