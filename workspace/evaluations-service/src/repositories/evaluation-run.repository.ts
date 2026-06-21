import { DataSource, FindOptionsOrder } from "typeorm";
import { EvaluationRun, EvaluationRunStatus } from "../models/evaluation-run";
import { BaseRepository } from "./base.repository";

const evaluationRunRelations = {
    evaluation: {
        exposures: true,
        stressTests: true
    }
};

export class EvaluationRunRepository extends BaseRepository<EvaluationRun> {

    constructor(
        dataSource: DataSource
    ) {
        super(
            dataSource.getRepository(EvaluationRun),
            "id"
        );
    }

    findDetailedById(
        id: string
    ) {
        return this.findById(
            id,
            evaluationRunRelations
        );
    }

    findByPortfolioId(
        portfolioId: string,
        skip = 0,
        take = 25,
        order: FindOptionsOrder<EvaluationRun> = {
            createdAt: "DESC"
        }
    ) {
        return this.repo.findAndCount({
            where: {
                portfolioId
            },
            skip,
            take,
            order,
            relations: evaluationRunRelations
        });
    }

    findByStatus(
        status: EvaluationRunStatus,
        skip = 0,
        take = 25
    ) {
        return this.repo.findAndCount({
            where: {
                status
            },
            skip,
            take,
            order: {
                createdAt: "DESC"
            },
            relations: evaluationRunRelations
        });
    }

    findPaginatedDetailed(
        skip = 0,
        take = 25
    ) {
        return this.repo.findAndCount({
            skip,
            take,
            order: {
                createdAt: "DESC"
            },
            relations: evaluationRunRelations
        });
    }
}
