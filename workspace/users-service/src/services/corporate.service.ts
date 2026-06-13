import { Corporate } from "../models/corporate";
import { CorporateRepository } from "../repositories/corporate.repository";
import { AppError } from "../utils/appError";
import { CreateCorporateDto } from "../dtos/create-corporate.dto";
import { UpdateCorporateDto } from "../dtos/update-corporate.dto";
import { BaseService } from "./base.service";
import { UserService } from "./user.service";

export class CorporateService extends BaseService<Corporate, CreateCorporateDto, UpdateCorporateDto> {
  constructor(
    private readonly corporateRepo: CorporateRepository,
    private readonly userService: UserService
  ) {
    super(corporateRepo);
  }

  async createCorporate(dto: CreateCorporateDto): Promise<Corporate> {
    const newUser = await this.userService.createUser(dto);
    const corporate = this.corporateRepo.create({
      userId: newUser.id,
      corporateName: dto.corporateName,
      companyRegNo: dto.companyRegNo,
      vatId: dto.vatId,
    });
    return this.corporateRepo.save(corporate);
  }

  async getCorporateByUserId(userId: number): Promise<Corporate | null> {
    return this.corporateRepo.findByUserId(userId);
  }

  async getCorporateDetails(userId: number): Promise<import("../dtos/corporate-details.dto").CorporateDetailsDto | null> {
    return this.corporateRepo.findCorporateDetails(userId);
  }

  async getCorporateDetailsByPublicId(publicId: string): Promise<import("../dtos/corporate-details.dto").CorporateDetailsDto | null> {
    return this.corporateRepo.findCorporateDetailsByPublicId(publicId);
  }

  async listCorporates(page = 1, pageSize = 25) {
    const skip = (page - 1) * pageSize;
    const { data, total } = await this.corporateRepo.listAllDetails(skip, pageSize);
    return { data, total, page, pageSize };
  }

  async updateCorporate(userId: number, dto: UpdateCorporateDto) {
    const existing = await this.corporateRepo.findByUserId(userId);
    if (!existing) throw new AppError(404, "Corporate profile not found");
    return this.corporateRepo.update(userId, dto);
  }

  async deleteCorporate(userId: number) {
    const existing = await this.corporateRepo.findByUserId(userId);
    if (!existing) throw new AppError(404, "Corporate profile not found");
    await this.corporateRepo.delete(userId);
  }
}
