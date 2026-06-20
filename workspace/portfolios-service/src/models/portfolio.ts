import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { OwnerType } from '../types/enums';
import { Holding } from './holding';
import { IsNotEmpty } from 'class-validator';

@Entity({ name: 'portfolios' })
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @IsNotEmpty()
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'text', name: 'owner_type', enum: OwnerType })
  ownerType!: OwnerType;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', name: 'base_currency' })
  baseCurrency!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => Holding, (holding) => holding.portfolio)
  holdings!: Holding[];
}