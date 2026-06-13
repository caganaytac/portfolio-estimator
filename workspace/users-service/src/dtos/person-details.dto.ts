export class PersonDetailsDto {
  userId!: number;
  publicId!: string;
  email!: string;
  role!: string;
  status!: string;
  firstName!: string;
  lastName!: string;
  dateOfBirth!: Date;
  taxId?: string;
  taxResidenceCountry?: string;
  riskClass?: string;
  investmentHorizon?: number;
  createdAt!: Date;
  updatedAt!: Date;
}