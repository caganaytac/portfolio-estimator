import { _default } from './../../../evaluations-service/node_modules/@types/validator/index.d';
// portfolio.service.ts
import { BaseService } from "./base.service";
import { BaseRepository } from "../repositories/base.repository";
import { Portfolio } from "../models/portfolio";
import { CreatePortfolioDto } from "../dtos/create-portfolio.dto";
import { UpdatePortfolioDto } from "../dtos/update-portfolio.dto";
import { AppError } from "../utils/appError";
import { HoldingService } from "./holding.service";
import { PortfolioDetailsDto } from "../dtos/portfolio-details.dto";


export class PortfolioService extends BaseService<Portfolio, CreatePortfolioDto, UpdatePortfolioDto> {
  constructor(
    repo: BaseRepository<Portfolio>,
    private readonly holdingService: HoldingService,
  ) {
    super(repo);
  }
  

  async createForUser(userId: string, dto: CreatePortfolioDto): Promise<Portfolio> {
    const exists = await this.repo.exists({
      userId: userId,
      name: dto.name,
    } as any);

    if (exists) {
      throw new AppError(409, `Portfolio named '${dto.name}' already exists for this user`);
    }

    const entity = this.repo.create({userId: userId, name: dto.name, baseCurrency: dto.baseCurrency, ownerType: dto.ownerType});
    return this.repo.save(entity);
  }

  // 404 for both "doesn't exist" and "exists but isn't yours" — prevents enumeration
  async getOwnedById(id: string, userId: string): Promise<Portfolio> {
    const portfolio = await this.repo.findById(id);
    if (!portfolio || (portfolio as any).userId !== userId) {
      throw new AppError(404, "Portfolio not found");
    }
    return portfolio;
  }

  async findAllForUser(userId: string, page = 1, pageSize = 25) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await this.repo.findPaginated(
      skip,
      pageSize,
      undefined,
      { userId: userId } as any,
    );
    return { data, total, page, pageSize };
  }

  async getDetails(id: string, userId: string): Promise<PortfolioDetailsDto> {
    const portfolio = await this.getOwnedById(id, userId);
    const holdings = await this.holdingService.listHoldingDetailsByPortfolioId(id);

    const hasAllPrices = holdings.every((h: any) => h.asset?.lastPrice != null);

    const totalCostBasis = holdings.reduce(
      (sum: number, h: any) => sum + Number(h.quantity) * Number(h.averagePurchasePrice),
      0,
    );

    const totalValue = hasAllPrices
      ? holdings.reduce(
          (sum: number, h: any) => sum + Number(h.quantity) * Number(h.asset.lastPrice),
          0,
        )
      : 0;

    const totalUnrealizedPnl = totalValue !== 0 ? totalValue - totalCostBasis : 0;

    const totalUnrealizedPnlPct =
      totalUnrealizedPnl !== null && totalCostBasis > 0
        ? (totalUnrealizedPnl / totalCostBasis) * 100
        : 0;

    return {
      id: portfolio.id,
      userId: portfolio.userId,
      ownerType: portfolio.ownerType,
      name: portfolio.name,
      baseCurrency: portfolio.baseCurrency,
      createdAt: portfolio.createdAt,
      holdings: holdings,
      totalValue,
      totalCostBasis,
      totalUnrealizedPnl,
      totalUnrealizedPnlPct,
    };
  }

  async deleteForUser(id: string, userId: string): Promise<void> {
    await this.getOwnedById(id, userId);
    await this.repo.delete(id);
  }
}