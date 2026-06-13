import { IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class CreateCorporateDto extends CreateUserDto {

  @IsNotEmpty()
  @IsString()
  corporateName!: string;

  @IsOptional()
  @IsString()
  companyRegNo?: string;

  @IsOptional()
  @IsString()
  vatId?: string;
}
