import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Portfolio } from './portfolio';
import { Asset } from './asset';

@Entity({ name: 'holdings' })
export class Holding {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'portfolio_id' })
  portfolioId!: string;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.holdings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'portfolio_id' })
  portfolio!: Portfolio;

  @Index()
  @Column({ type: 'uuid', name: 'asset_id' })
  assetId!: string;

  // NEW — without this, "asset" isn't a valid relation to join at all
  @ManyToOne(() => Asset)
  @JoinColumn({ name: 'asset_id' })
  asset!: Asset;

  @Column({ type: 'numeric', precision: 20, scale: 8 })
  quantity!: number;

  @Column({ type: 'numeric', precision: 20, scale: 8, name: 'average_purchase_price' })
  averagePurchasePrice!: number;

  @Column({ type: 'date', name: 'purchase_date' })
  purchaseDate!: Date;
}