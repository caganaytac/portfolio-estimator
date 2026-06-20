// holding.repository.ts
import { DataSource } from "typeorm";
import { BaseRepository } from "./base.repository";
import { Holding } from "../models/holding";

export class HoldingRepository extends BaseRepository<Holding> {
  constructor(dataSource: DataSource) {
    super(dataSource.getRepository(Holding), "id");
  }

  // joins asset so callers get h.asset.lastPrice etc.
  findByPortfolioId(portfolioId: string) {
    return this.repo.find({
      where: { portfolioId },
      relations: { asset: true },
    });
  }

  // joins asset here too — used to check for an existing position before
  // merging quantities (weighted-average logic), and joining asset keeps
  // this consistent if a caller ever needs price context here
  findByPortfolioAndAsset(portfolioId: string, assetId: string) {
    return this.repo.findOne({
      where: { portfolioId, assetId },
      relations: { asset: true },
    });
  }

  findByAssetAndPortfolio(assetId: string, portfolioId: string) {
    return this.repo.find({
      where: { assetId, portfolioId },
      relations: { asset: true },
    });
  }

  // list all holdings for a portfolio, joined with asset,
  // ready to be mapped into HoldingDetailsDto[]
  listHoldingDetailsByPortfolioId(portfolioId: string) {
    return this.repo.find({
      where: { portfolioId },
      relations: { asset: true },
      order: { purchaseDate: "DESC" },
    });
  }

  async deleteByPortfolioId(portfolioId: string) {
    await this.repo.delete({ portfolioId } as Partial<Holding>);
  }
}