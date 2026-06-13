import {
  Entity,
  Column,
  PrimaryColumn,
} from "typeorm";

@Entity("persons")
export class Person {
  @PrimaryColumn({ name: "user_id", type: "integer" })
  userId!: number;

  @Column({
    name: "first_name",
    type: "varchar",
    length: 100,
  })
  firstName!: string;

  @Column({
    name: "last_name",
    type: "varchar",
    length: 100,
  })
  lastName!: string;

  @Column({
    name: "date_of_birth",
    type: "date",
  })
  dateOfBirth!: Date;

  @Column({
    name: "tax_id",
    type: "varchar",
    length: 50,
    nullable: true,
  })
  taxId?: string;

  @Column({
    name: "tax_residence_country",
    type: "char",
    length: 2,
    nullable: true,
  })
  taxResidenceCountry?: string;

  @Column({
    name: "risk_class",
    type: "char",
    length: 1,
    nullable: true,
  })
  riskClass?: string;

  @Column({
    name: "investment_horizon",
    type: "integer",
    nullable: true,
  })
  investmentHorizon?: number;
}