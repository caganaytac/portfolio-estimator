import { DataSource, FindOptionsOrder } from "typeorm";
import { Person } from "../models/person";
import { BaseRepository } from "./base.repository";
import { PersonDetailsDto } from "../dtos/person-details.dto";

/**
 * Repository for the `persons` table.
 *
 * The table is keyed by the numeric `userId` which links to the `users` table.
 * This repository exposes both basic CRUD (via `BaseRepository`) and
 * domain-specific queries that join `users` to surface `publicId` and user-level fields.
 */
export class PersonRepository extends BaseRepository<Person> {
  constructor(dataSource: DataSource) {
    super(dataSource.getRepository(Person), "userId");
  }


  async findPersonDetailsById(userId: number): Promise<PersonDetailsDto | null> {
    // Build a projection joining `persons` -> `users`. We use raw selects with aliases
    // so `getRawOne()` returns plain object keys we can map to the DTO consistently.
    const raw = await this.repo
      .createQueryBuilder("p")
      .innerJoin("users", "u", "p.userId = u.id")
      .select([
        "p.user_id as \"userId\"",
        "u.public_id as \"publicId\"",
        "u.email as \"email\"",
        "u.role as \"role\"",
        "u.status as \"status\"",
        "p.first_name as \"firstName\"",
        "p.last_name as \"lastName\"",
        "p.date_of_birth as \"dateOfBirth\"",
        "p.tax_id as \"taxId\"",
        "p.tax_residence_country as \"taxResidenceCountry\"",
        "p.risk_class as \"riskClass\"",
        "p.investment_horizon as \"investmentHorizon\"",
        "u.createdAt as \"createdAt\"",
        "u.updatedAt as \"updatedAt\"",
      ])
      .where("p.userId = :userId", { userId })
      .getRawOne();

    if (!raw) return null;

    // Map raw DB values to the DTO shape, converting dates and numbers safely.
    const dto: PersonDetailsDto = {
      userId: Number(raw.userId),
      publicId: raw.publicId,
      email: raw.email,
      role: raw.role,
      status: raw.status,
      firstName: raw.firstName,
      lastName: raw.lastName,
      dateOfBirth: raw.dateOfBirth ? new Date(raw.dateOfBirth) : (null as any),
      taxId: raw.taxId,
      taxResidenceCountry: raw.taxResidenceCountry,
      riskClass: raw.riskClass,
      investmentHorizon: raw.investmentHorizon ? Number(raw.investmentHorizon) : undefined,
      createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
    };

    return dto;
  }

  async findPersonDetailsByPublicId(publicId: string): Promise<PersonDetailsDto | null> {
    const raw = await this.repo
      .createQueryBuilder("p")
      .innerJoin("users", "u", "p.userId = u.id")
      .select([
        "p.user_id as \"userId\"",
        "u.public_id as \"publicId\"",
        "u.email as \"email\"",
        "u.role as \"role\"",
        "u.status as \"status\"",
        "p.first_name as \"firstName\"",
        "p.last_name as \"lastName\"",
        "p.date_of_birth as \"dateOfBirth\"",
        "p.tax_id as \"taxId\"",
        "p.tax_residence_country as \"taxResidenceCountry\"",
        "p.risk_class as \"riskClass\"",
        "p.investment_horizon as \"investmentHorizon\"",
        "u.createdAt as \"createdAt\"",
        "u.updatedAt as \"updatedAt\"",
      ])
      .where("u.public_id = :publicId", { publicId })
      .getRawOne();

    if (!raw) return null;

    const dto: PersonDetailsDto = {
      userId: Number(raw.userId),
      publicId: raw.publicId,
      email: raw.email,
      role: raw.role,
      status: raw.status,
      firstName: raw.firstName,
      lastName: raw.lastName,
      dateOfBirth: raw.dateOfBirth ? new Date(raw.dateOfBirth) : (null as any),
      taxId: raw.taxId,
      taxResidenceCountry: raw.taxResidenceCountry,
      riskClass: raw.riskClass,
      investmentHorizon: raw.investmentHorizon ? Number(raw.investmentHorizon) : undefined,
      createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
    };

    return dto;
  }

  async listAllDetails(skip = 0, take = 25): Promise<{ data: PersonDetailsDto[]; total: number }> {
  const qb = this.repo
    .createQueryBuilder("p")
    .innerJoin("users", "u", "p.userId = u.id")
    .select([
      "p.user_id as \"userId\"",
      "u.public_id as \"publicId\"",
      "u.email as \"email\"",
      "u.role as \"role\"",
      "u.status as \"status\"",
      "p.first_name as \"firstName\"",
      "p.last_name as \"lastName\"",
      "p.date_of_birth as \"dateOfBirth\"",
      "p.tax_id as \"taxId\"",
      "p.tax_residence_country as \"taxResidenceCountry\"",
      "p.risk_class as \"riskClass\"",
      "p.investment_horizon as \"investmentHorizon\"",
      "u.created_at as \"createdAt\"",
      "u.updated_at as \"updatedAt\"",
    ])
    .orderBy("u.created_at", "ASC")
    .offset(skip)
    .limit(take);

  const raw = await qb.getRawMany();

  const total = await this.repo
    .createQueryBuilder("p")
    .innerJoin("users", "u", "p.user_id = u.id")
    .getCount();

  const data: PersonDetailsDto[] = raw.map((r: any) => ({
    userId: Number(r.userId),
    publicId: r.publicId,
    email: r.email,
    role: r.role,
    status: r.status,
    firstName: r.firstName,
    lastName: r.lastName,
    dateOfBirth: r.dateOfBirth ? new Date(r.dateOfBirth) : (null as any),
    taxId: r.taxId,
    taxResidenceCountry: r.taxResidenceCountry,
    riskClass: r.riskClass,
    investmentHorizon: r.investmentHorizon != null ? Number(r.investmentHorizon) : undefined,
    createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt) : new Date(),
  }));

  return { data, total };
}
}
