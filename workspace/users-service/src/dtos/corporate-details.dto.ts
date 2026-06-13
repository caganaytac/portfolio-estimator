export class CorporateDetailsDto {
  userId!: number;
  publicId!: string;
  email!: string;
  role!: string;
  status!: string; // or your custom UserStatus enum
  corporateName!: string;
  companyRegNo!: string;
  vatId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}