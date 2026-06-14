import { IsEmail, IsNotEmpty } from "class-validator";

export class CorporateRegisterDTO {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  corporateName!: string;

  @IsNotEmpty()
  companyRegNo!: string;

  @IsNotEmpty()
  vatId!: string;
}