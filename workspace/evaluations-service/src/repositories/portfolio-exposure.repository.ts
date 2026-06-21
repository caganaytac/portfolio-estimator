import { DataSource } from "typeorm";
import { PortfolioExposure } from "../models/portfolio-exposure";
import { BaseRepository } from "./base.repository";

export class PortfolioExposureRepository extends BaseRepository<PortfolioExposure> {

    constructor(
        dataSource: DataSource
    ) {
        super(
            dataSource.getRepository(PortfolioExposure),
            "id"
        );
    }
}
