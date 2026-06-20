import { BaseService } from "./base.service";
import { HoldingRepository } from "../repositories/holding.repository";
import { Holding } from "../models/holding";
import { CreateHoldingDto } from "../dtos/create-holding.dto";
import { UpdateHoldingDto } from "../dtos/update-holding.dto";
import { HoldingDetailsDto } from "../dtos/holding-details.dto";
import { AppError } from "../utils/appError";
import { AssetService } from "./asset.service";

export class HoldingService extends BaseService<Holding, CreateHoldingDto, UpdateHoldingDto> {
  constructor(
    protected readonly repo: HoldingRepository,
    private readonly assetService: AssetService
  ) {
    super(repo);
  }

  async create(dto: CreateHoldingDto): Promise<Holding> {
    // validate inputs before anything else, not just on update
    if (dto.quantity <= 0) {
      throw new AppError(400, "Quantity must be greater than zero");
    }
    if (dto.averagePurchasePrice < 0) {
      throw new AppError(400, "Average purchase price cannot be negative");
    }

    const asset = await this.assetService.getById(dto.assetId);
    if (!asset) throw new AppError(404, "Asset not found");

    // race condition: two concurrent requests can both see "no existing row"
    // and both insert, relying on the DB's UNIQUE(portfolio_id, asset_id) to
    // catch the collision rather than the find-then-branch logic above.
    // We attempt insert first, and treat a unique-violation as "go merge instead."
    try {
      dto.purchaseDate = new Date();
      const entity = this.repo.create(dto as any);
      return await this.repo.save(entity);
    } catch (err: any) {
      const isUniqueViolation = err?.code === "23505"; // Postgres unique_violation
      if (!isUniqueViolation) throw err;
    }

    // fell through because the row already existed — merge with a weighted average.
    // Still technically racy between two *merges* happening concurrently (a second
    // race condition one level down), so this should run inside a DB transaction
    // with a row lock (SELECT ... FOR UPDATE) in production. Flagging rather than
    // fully solving here since it depends on your transaction setup.
    const existing = await this.repo.findByPortfolioAndAsset(dto.portfolioId, dto.assetId);
    if (!existing) {
      // extremely unlikely (deleted between the failed insert and this lookup),
      // but don't silently return undefined
      throw new AppError(409, "Concurrent modification — please retry");
    }

    const totalQty = Number(existing.quantity) + dto.quantity;
    // #2 — totalQty can only be 0 here if both quantities were 0, but we already
    // reject dto.quantity <= 0 above, so totalQty > 0 is guaranteed; kept as a
    // defensive check anyway since "guaranteed by an earlier check" is fragile
    if (totalQty <= 0) {
      throw new AppError(400, "Resulting quantity must be greater than zero");
    }

    const newAvgPrice =
      (Number(existing.quantity) * Number(existing.averagePurchasePrice) +
        dto.quantity * dto.averagePurchasePrice) /
      totalQty;

    const updated = await this.repo.update(existing.id, {
      quantity: totalQty,
      averagePurchasePrice: newAvgPrice,
    } as any);

    if (!updated) throw new AppError(500, "Failed to update holding after merge");
    return updated;
  }

  async update(id: string, dto: UpdateHoldingDto): Promise<Holding> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError(404, "Holding not found");

    if (dto.quantity !== undefined && dto.quantity < 0) {
      throw new AppError(400, "Quantity cannot be negative");
    }
    if (dto.averagePurchasePrice !== undefined && dto.averagePurchasePrice < 0) {
      throw new AppError(400, "Average purchase price cannot be negative");
    }

    // #11 — repo.update() in your BaseRepository already re-fetches and
    // returns the entity (not a raw UpdateResult), so this is fine as long
    // as that contract holds; asserting non-null since we just confirmed
    // the row exists above
    const updated = await this.repo.update(id, dto as any);
    if (!updated) throw new AppError(500, "Failed to update holding");
    return updated;
  }

  async findByPortfolio(portfolioId: string): Promise<Holding[]> {
    return this.repo.findByPortfolioId(portfolioId);
  }

  async reduceQuantity(id: string, sellQuantity: number): Promise<Holding> {
    // #9 — reject non-positive sell quantities; previously a negative
    // sellQuantity would silently increase the holding instead of reducing it
    if (sellQuantity <= 0) {
      throw new AppError(400, "Sell quantity must be greater than zero");
    }

    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError(404, "Holding not found");

    const remaining = Number(existing.quantity) - sellQuantity;
    if (remaining < 0) {
      throw new AppError(400, "Cannot sell more than the current holding quantity");
    }

    // #10 — business decision: zero-quantity holdings are kept as closed-position
    // records rather than auto-deleted. Flagging this explicitly rather than
    // silently picking a behavior — confirm this is what you want.
    const updated = await this.repo.update(id, { quantity: remaining } as any);
    if (!updated) throw new AppError(500, "Failed to update holding");
    return updated;
  }

  // #7 — guard against a missing asset relation instead of letting a raw
  // "Cannot read properties of undefined" escape to the client
  private toHoldingDetailsDto(h: Holding & { asset?: any }): HoldingDetailsDto {
    if (!h.asset) {
      throw new AppError(500, "Asset relation missing on holding — check repository query joins");
    }

    const quantity = Number(h.quantity);
    const averagePurchasePrice = Number(h.averagePurchasePrice);
    const lastPrice = h.asset.lastPrice != null ? Number(h.asset.lastPrice) : null;

    const costBasis = quantity * averagePurchasePrice;
    const currentValue = lastPrice !== null ? quantity * lastPrice : null;
    const unrealizedPnl = currentValue !== null ? currentValue - costBasis : null;
    const unrealizedPnlPct =
      unrealizedPnl !== null && costBasis > 0 ? (unrealizedPnl / costBasis) * 100 : null;

    // #8 — no more `as number` casts; DTO fields below must be typed
    // `number | null` for this to type-check honestly. See note after the code.
    return {
      id: h.id,
      portfolioId: h.portfolioId,
      asset: {
        id: h.asset.id,
        symbol: h.asset.symbol,
        name: h.asset.name,
        assetClass: h.asset.assetClass,
        currency: h.asset.currency,
        exchange: h.asset.exchange,
        lastPrice: h.asset.lastPrice,
        lastPriceUpdatedAt: h.asset.lastPriceUpdatedAt,
        metadata: h.asset.metadata,
        createdAt: h.asset.createdAt,
        updatedAt: h.asset.updatedAt,
      },
      quantity,
      averagePurchasePrice,
      purchaseDate: h.purchaseDate,
      currentValue,
      costBasis,
      unrealizedPnl,
      unrealizedPnlPct,
    };
  }

  async listHoldingDetailsByPortfolioId(portfolioId: string): Promise<HoldingDetailsDto[]> {
    const holdings = await this.repo.listHoldingDetailsByPortfolioId(portfolioId);
    return holdings.map((h) => this.toHoldingDetailsDto(h));
  }

  async findHoldingDetailsByAssetId(assetId: string, portfolioId: string): Promise<HoldingDetailsDto[]> {
    const holdings = await this.repo.findByAssetAndPortfolio(assetId, portfolioId);
    return holdings.map((h) => this.toHoldingDetailsDto(h));
  }
}