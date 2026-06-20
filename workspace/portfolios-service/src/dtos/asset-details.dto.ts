export class AssetDetailsDto {
  id!: string;
  symbol!: string;
  name!: string;
  assetClass!: string;
  currency!: string;
  exchange!: string | null;
  lastPrice!: number | null;
  lastPriceUpdatedAt!: Date | null;
  metadata!: Record<string, unknown>;
  createdAt!: Date;
  updatedAt!: Date;
}