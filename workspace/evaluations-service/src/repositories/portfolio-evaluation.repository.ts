import { DataSource } from "typeorm";
import { PortfolioEvaluation } from "../models/portfolio-evaluation";
import { BaseRepository } from "./base.repository";

export class PortfolioEvaluationRepository extends BaseRepository<PortfolioEvaluation> {

    constructor(
        dataSource: DataSource
    ) {
        super(
            dataSource.getRepository(PortfolioEvaluation),
            "id"
        );
    }
}
