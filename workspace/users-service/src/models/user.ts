import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Generated,
} from "typeorm";

export enum UserStatus {
  ACTIVE = "active",
  DISABLED = "disabled",
  LOCKED = "locked",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("identity")
  id!: number;

  @Index({ unique: true })
  @Column({ type: "uuid", name: "public_id" })
  @Generated("uuid")
  publicId!: string;

  @Index({ unique: true })
  @Column({ unique: true, name: "email" })
  email!: string;


  @Column({name: "password_hash" })
  passwordHash!: string;

  @Column({ default: "user", name: "role" })
  role!: string;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE, name: "status" })
  status!: UserStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}