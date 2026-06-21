import { DataSource } from "typeorm";
import { PortfolioStressTest } from "../models/portfolio-stress-test";
import { BaseRepository } from "./base.repository";

export class PortfolioStressTestRepository extends BaseRepository<PortfolioStressTest> {

    constructor(
        dataSource: DataSource
    ) {
        super(
            dataSource.getRepository(PortfolioStressTest),
            "id"
        );
    }
}
