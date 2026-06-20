import { IsOptional, IsString, Length } from "class-validator";

/* ownerType and userId are intentionally omitted:
   ownership of a portfolio is immutable once created. */
export class UpdatePortfolioDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;
 
  @IsOptional()
  @IsString()
  @Length(3, 3)
  baseCurrency?: string;
}