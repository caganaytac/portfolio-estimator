import { IsOptional, IsString } from "class-validator";

export class UpdateCorporateDto {
  @IsOptional()
  @IsString()
  corporateName?: string;

  @IsOptional()
  @IsString()
  companyRegNo?: string;

  @IsOptional()
  @IsString()
  vatId?: string;
}
