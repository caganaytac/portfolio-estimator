import { BaseService } from "./base.service";
import { BaseRepository } from "../repositories/base.repository";
import { Asset } from "../models/asset";
import { CreateAssetDto } from "../dtos/create-asset.dto";
import { UpdateAssetDto } from "../dtos/update-asset.dto";
import { AppError } from "../utils/appError";

export class AssetService extends BaseService<Asset, CreateAssetDto, UpdateAssetDto> {
  constructor(repo: BaseRepository<Asset>) {
    super(repo);
  }

  async create(dto: CreateAssetDto): Promise<Asset> {
    const exists = await this.repo.exists({ symbol: dto.symbol } as any);
    if (exists) {
      throw new AppError(409, `Asset with symbol '${dto.symbol}' already exists`);
    }
    const entity = this.repo.create(dto as any);
    return this.repo.save(entity);
  }

  async update(id: string, dto: UpdateAssetDto): Promise<Asset | null> {
    if ("symbol" in dto) {
      throw new AppError(400, "Asset symbol cannot be changed after creation");
    }
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError(404, "Asset not found");
    return this.repo.update(id, dto as any);
  }

  async findBySymbol(symbol: string): Promise<Asset | null> {
    return this.repo.findOne({ symbol } as any);
  }

  async findByClass(assetClass: string, page = 1, pageSize = 25) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await this.repo.findPaginated(
      skip,
      pageSize,
      undefined,
      { assetClass: assetClass } as any,
    );
    return { data, total, page, pageSize };
  }

  // called by a price-fetching job, not the general update path
  async updatePrice(id: string, price: number): Promise<Asset | null> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError(404, "Asset not found");
    if (price < 0) throw new AppError(400, "Price cannot be negative");

    return this.repo.update(id, {
      lastPrice: price,
      lastPpriceUpdatedAt: new Date(),
    } as any);
  }
}