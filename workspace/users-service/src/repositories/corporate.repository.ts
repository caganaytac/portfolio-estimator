import { DataSource, FindOptionsOrder } from "typeorm";
import { Corporate } from "../models/corporate";
import { BaseRepository } from "./base.repository";
import { CorporateDetailsDto } from "../dtos/corporate-details.dto";

/**
 * Repository for `Corporate` entities.
 *
 * Uses a `userId` primary key on the `corporates` table (one-to-one with `users`).
 * Extends `BaseRepository` to reuse common CRUD helpers and pagination behaviour.
 */
export class CorporateRepository extends BaseRepository<Corporate> {
  constructor(dataSource: DataSource) {
    // `userId` is the PK / FK on the `corporates` table; pass it to BaseRepository
    super(dataSource.getRepository(Corporate), "userId");
  }

  /**
   * Find corporate row by the internal numeric user id.
   * This is used for internal operations (updates/deletes) where numeric PK is required.
   */
  async findByUserId(userId: number) {
    return this.findById(userId);
  }

  /**
   * Paginated list of corporates. Returns [rows, total].
   */
  async findPaginated(skip: number, take: number) {
    return this.repo.findAndCount({ skip, take, order: { corporateName: "ASC" } as FindOptionsOrder<Corporate> });
  }
  /**
   * Fetch joined corporate + user details by internal user id.
   * Uses `getRawOne()` so the projection keys match the DTO shape.
   */
  async findCorporateDetails(userId: number): Promise<CorporateDetailsDto | null> {
    const raw = await this.repo
      .createQueryBuilder("c")
      // join the `users` table to surface publicId and user-level fields
      .innerJoin("users", "u", "c.user_id = u.id")
      .select([
        // Use explicit aliases so `getRawOne()` returns predictable keys
        "c.user_id as \"userId\"",
        "u.public_id as \"publicId\"",
        "u.email as \"email\"",
        "u.role as \"role\"",
        "u.status as \"status\"",
        "c.corporate_name as \"corporateName\"",
        "c.company_reg_no as \"companyRegNo\"",
        "c.vat_id as \"vatId\"",
        "u.createdAt as \"createdAt\"",
        "u.updatedAt as \"updatedAt\"",
      ])
      .where("c.user_id = :userId", { userId })
      .getRawOne();

    if (!raw) return null;

    // Map raw result to DTO with safe conversions for dates and numeric fields
    const dto: CorporateDetailsDto = {
      userId: Number(raw.userId),
      publicId: raw.publicId,
      email: raw.email,
      role: raw.role,
      status: raw.status,
      corporateName: raw.corporateName,
      companyRegNo: raw.companyRegNo,
      vatId: raw.vatId,
      createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
    };

    return dto;
  }

  /**
   * Fetch corporate details by user's public UUID (`publicId`).
   * External callers should use `publicId` (opaque) instead of numeric PK.
   */
  async findCorporateDetailsByPublicId(publicId: string): Promise<CorporateDetailsDto | null> {
    const raw = await this.repo
      .createQueryBuilder("c")
      .innerJoin("users", "u", "c.user_id = u.id")
      .select([
        "c.user_id as \"userId\"",
        "u.public_id as \"publicId\"",
        "u.email as \"email\"",
        "u.role as \"role\"",
        "u.status as \"status\"",
        "c.corporate_name as \"corporateName\"",
        "c.company_reg_no as \"companyRegNo\"",
        "c.vat_id as \"vatId\"",
        "u.createdAt as \"createdAt\"",
        "u.updatedAt as \"updatedAt\"",
      ])
      .where("u.public_id = :publicId", { publicId })
      .getRawOne();

    if (!raw) return null;

    const dto: CorporateDetailsDto = {
      userId: Number(raw.userId),
      publicId: raw.publicId,
      email: raw.email,
      role: raw.role,
      status: raw.status,
      corporateName: raw.corporateName,
      companyRegNo: raw.companyRegNo,
      vatId: raw.vatId,
      createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
    };

    return dto;
  }

  /**
   * Paginated projection of corporate + user details as `CorporateDetailsDto`.
   * Returns `{ data, total }` where `data` contains DTO-shaped items.
   */
  async listAllDetails(skip = 0, take = 25): Promise<{ data: CorporateDetailsDto[]; total: number }> {
    const qb = this.repo
      .createQueryBuilder("c")
      .innerJoin("users", "u", "c.user_id = u.id")
      .select([
        "c.user_id as \"userId\"",
        "u.public_id as \"publicId\"",
        "u.email as \"email\"",
        "u.role as \"role\"",
        "u.status as \"status\"",
        "c.corporate_name as \"corporateName\"",
        "c.company_reg_no as \"companyRegNo\"",
        "c.vat_id as \"vatId\"",
        "u.createdAt as \"createdAt\"",
        "u.updatedAt as \"updatedAt\"",
      ])
      .orderBy("u.createdAt", "DESC")
      .offset(skip)
      .limit(take);

    const raw = await qb.getRawMany();
    const total = await this.repo.createQueryBuilder("c").getCount();

    const data: CorporateDetailsDto[] = raw.map((r: any) => ({
      userId: Number(r.userId),
      publicId: r.publicId,
      email: r.email,
      role: r.role,
      status: r.status,
      corporateName: r.corporateName,
      companyRegNo: r.companyRegNo,
      vatId: r.vatId,
      createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
      updatedAt: r.updatedAt ? new Date(r.updatedAt) : new Date(),
    }));

    return { data, total };
  }
}
