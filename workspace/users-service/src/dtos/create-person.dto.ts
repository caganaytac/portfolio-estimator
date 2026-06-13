import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class CreatePersonDto extends CreateUserDto {

  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth!: Date;

  @IsString()
  taxId!: string;

  @IsString()
  taxResidenceCountry!: string;

  @IsString()
  riskClass!: string;

  @IsInt()
  investmentHorizon!: number;
}
