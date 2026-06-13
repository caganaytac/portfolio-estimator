import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { UserStatus } from "../models/user";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(["user", "admin", "manager"])
  role?: string;

  @IsOptional()
  @IsIn(Object.values(UserStatus))
  status?: UserStatus;

  @IsOptional()
  @MinLength(6)
  password?: string;
}

