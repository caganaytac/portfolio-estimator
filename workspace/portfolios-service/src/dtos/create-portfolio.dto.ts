import { IsEnum, IsString, Length } from "class-validator";
import { OwnerType } from "../types/enums";
 
export class CreatePortfolioDto {

  // no userId field — it's injected server-side from the JWT

  @IsEnum(OwnerType)
  ownerType!: OwnerType;
 
  @IsString()
  @Length(1, 255)
  name!: string;
 
  // ISO 4217 currency code, e.g. "EUR", "USD"
  @IsString()
  @Length(3, 3)
  baseCurrency!: string;
}