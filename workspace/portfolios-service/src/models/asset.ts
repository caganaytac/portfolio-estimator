import { Holding } from './holding';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { AssetClass } from '../types/enums';

@Entity({ name: 'assets' })
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'text' })
  symbol!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', name: 'asset_class', enum: AssetClass })
  assetClass!: AssetClass;

  @Column({ type: 'text' })
  currency!: string;

  @Column({ type: 'text', nullable: true })
  exchange!: string;

  @Column({ type: 'numeric', precision: 20, scale: 8, name: 'last_price', nullable: true })
  lastPrice!: string | null;

  @Column({ type: 'timestamptz', name: 'last_price_updated_at', nullable: true })
  lastPriceUpdatedAt!: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}