// holding-details.dto.ts
import { AssetDetailsDto } from './asset-details.dto';

export class HoldingDetailsDto {
  id!: string;
  portfolioId!: string;
  asset!: AssetDetailsDto;          
  quantity!: number;
  averagePurchasePrice!: number;
  purchaseDate!: Date;

  // derived/computed fields
  currentValue!: number | null;     // quantity * asset.lastPrice
  costBasis!: number;              // quantity * averagePurchasePrice
  unrealizedPnl!: number | null;     // unrealized profit or loss: currentValue - costBasis
  unrealizedPnlPct!: number | null; // (Unrealized Profit and Loss Percentage: unrealizedPnl / costBasis * 100
}