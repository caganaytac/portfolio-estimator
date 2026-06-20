import { IsUUID, IsNumber, Min, IsDateString, IsOptional} from 'class-validator';

export class CreateHoldingDto {
  @IsUUID()
  portfolioId!: string;

  @IsUUID()
  assetId!: string;

  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(0)
  quantity!: number;

  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(0)
  averagePurchasePrice!: number;

  @IsOptional()
  @IsDateString()
  purchaseDate?: Date;
}