import { DataSource } from "typeorm";
import { BaseRepository } from "./base.repository";
import { Asset } from "../models/asset";

export class AssetRepository extends BaseRepository<Asset> {
  constructor(dataSource: DataSource) {
    super(dataSource.getRepository(Asset), "id");
  }

  findBySymbol(symbol: string) {
    return this.repo.findOne({ where: { symbol } });
  }

  findByExchange(exchange: string) {
    return this.repo.find({ where: { exchange } });
  }

  findByClass(assetClass: string) {
    return this.repo.find({ where: { assetClass } as any });
  }
}