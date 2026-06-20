import { DataSource, FindOptionsOrder } from "typeorm";
import { BaseRepository } from "./base.repository";
import { Portfolio } from "../models/portfolio";

export class PortfolioRepository extends BaseRepository<Portfolio> {
  constructor(dataSource: DataSource) {
    super(dataSource.getRepository(Portfolio), "id");
  }

  findByUserId(userId: string) {
    return this.repo.find({ where: { userId } });
  }

  findByUserIdPaginated(
    userId: string,
    skip = 0,
    take = 25,
    order?: FindOptionsOrder<Portfolio>,
  ) {
    return this.repo.findAndCount({ where: { userId }, skip, take, order });
  }

  findWithHoldings(id: string) {
    return this.repo.findOne({
      where: { id }
    });
  }

  findOwnedWithHoldings(id: string, userId: string) {
    return this.repo.findOne({
      where: { id, userId }
    });
  }

  // NEW — paginated list of a user's portfolios, each with holdings + asset
  // joined in, so the service layer can compute rollup totals for every
  // portfolio in the page without any further queries
  listPortfolioDetailsByUserId(
    userId: string,
    skip = 0,
    take = 25,
    order?: FindOptionsOrder<Portfolio>,
  ) {
    return this.repo.findAndCount({
      where: { userId },
      skip,
      take,
      order,
    });
  }
}