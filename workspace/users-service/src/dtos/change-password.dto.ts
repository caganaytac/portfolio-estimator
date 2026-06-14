import { IsNotEmpty, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty()
  publicId!: string;

  @IsNotEmpty()
  currentPassword!: string;

  @IsNotEmpty()
  @MinLength(8)
  newPassword!: string;
}

