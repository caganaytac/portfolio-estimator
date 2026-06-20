import { IsEnum, IsObject, IsOptional, IsString, Length, Matches } from "class-validator";
import { AssetClass } from "../types/enums";

export class UpdateAssetDto {
  @IsOptional() @IsString() @Length(1, 20)
  symbol?: string;

  @IsOptional() @IsString()
  name?: string;

  @IsOptional() @IsEnum(AssetClass)
  assetClass?: AssetClass;

  @IsOptional() @IsString() @Matches(/^[A-Z]{3}$/)
  currency?: string;

  @IsOptional() @IsString()
  exchange?: string;

  @IsOptional() @IsObject()
  metadata?: Record<string, unknown>;
}