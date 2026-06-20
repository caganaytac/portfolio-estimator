import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject, Length, Matches} from 'class-validator';
import { AssetClass, BaseCurrency } from './../types/enums';


export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  symbol!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(AssetClass)
  assetClass!: AssetClass;

  @IsEnum(BaseCurrency)
  @IsString()
  @Matches(/^[A-Z]{3}$/, { message: 'currency must be a 3-letter ISO code' })
  currency!: string;

  @IsOptional()
  @IsString()
  exchange?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}