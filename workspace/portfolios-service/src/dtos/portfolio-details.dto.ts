import { OwnerType } from '../types/enums';
import { HoldingDetailsDto } from './holding-details.dto';

export class PortfolioDetailsDto {
  id!: string;
  userId!: string;
  ownerType!: OwnerType;
  name!: string;
  baseCurrency!: string;
  createdAt!: Date;

  holdings!: HoldingDetailsDto[];

  // derived details
  totalValue!: number;
  totalCostBasis!: number;
  totalUnrealizedPnl!: number;
  totalUnrealizedPnlPct!: number;
}