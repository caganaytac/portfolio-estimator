import { IsOptional, IsString, IsDateString, IsInt } from "class-validator";

export class UpdatePersonDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  taxResidenceCountry?: string;

  @IsOptional()
  @IsString()
  riskClass?: string;

  @IsOptional()
  @IsInt()
  investmentHorizon?: number;
}
