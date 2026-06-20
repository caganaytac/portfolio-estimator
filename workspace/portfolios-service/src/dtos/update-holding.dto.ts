import { IsOptional, IsDateString, Matches } from "class-validator";
import { DECIMAL_20_8_REGEX, DECIMAL_20_8_MESSAGE } from "../utils/validators";

/*  assetId and portfolioId are intentionally omitted: re-pointing a holding
  to a different asset/portfolio should go through delete + create instead. */
export class UpdateHoldingDto {
  @IsOptional()
  @Matches(DECIMAL_20_8_REGEX, { message: `quantity ${DECIMAL_20_8_MESSAGE}` })
  quantity?: number;
 
  @IsOptional()
  @Matches(DECIMAL_20_8_REGEX, { message: `averagePurchasePrice ${DECIMAL_20_8_MESSAGE}` })
  averagePurchasePrice?: number;
 
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;
}