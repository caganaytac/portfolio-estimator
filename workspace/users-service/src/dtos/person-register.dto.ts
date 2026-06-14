import { IsEmail, IsNotEmpty, IsDate, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";

export class PersonRegisterDTO {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  firstName!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth!: Date;

  @IsNotEmpty()
  taxId!: string;

  @IsNotEmpty()
  taxResidenceCountry!: string;

  @IsNotEmpty()
  riskClass!: string;

  @IsNumber()
  @Min(0)
  investmentHorizon!: number;
}