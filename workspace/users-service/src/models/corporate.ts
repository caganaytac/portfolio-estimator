import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("corporates")
export class Corporate {
  @PrimaryColumn({ name: "user_id", type: "integer" })
  userId!: number;

  @Column({ name: "corporate_name", type: "varchar", length: 150 })
  corporateName!: string;

  @Column({ name: "company_reg_no", type: "varchar", length: 50, nullable: true })
  companyRegNo?: string;

  @Column({ name: "vat_id", type: "varchar", length: 50, nullable: true })
  vatId?: string;
}


