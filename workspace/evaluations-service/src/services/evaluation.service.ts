import { AiService } from "../ai/services/ai.service";
import type { EvaluationContext, Exposure, StressTest } from "../ai/types/agent.types";
import type { AdvisoryResponse } from "../ai/types/advisory.types";
import { PortfolioClient } from "../clients/portfolio.client";
import { EvaluationRun, EvaluationRunStatus } from "../models/evaluation-run";
import { PortfolioEvaluation } from "../models/portfolio-evaluation";
import {
    PortfolioExposure,
    PortfolioExposureType
} from "../models/portfolio-exposure";
import { PortfolioStressTest } from "../models/portfolio-stress-test";
import { EvaluationRunRepository } from "../repositories/evaluation-run.repository";
import { PortfolioEvaluationRepository } from "../repositories/portfolio-evaluation.repository";
import { PortfolioExposureRepository } from "../repositories/portfolio-exposure.repository";
import { PortfolioStressTestRepository } from "../repositories/portfolio-stress-test.repository";
import { AppError } from "../utils/appError";

export interface CreateEvaluationRunInput {
    portfolioId: string;
    inputSnapshot?: Record<string, unknown>;
    evaluation: EvaluationContext;
    runAi?: boolean;
}

export interface EvaluationRunPage {
    data: EvaluationRun[];
    total: number;
    page: number;
    pageSize: number;
}

export class EvaluationService {

    constructor(
        private readonly evaluationRunRepository: EvaluationRunRepository,
        private readonly portfolioEvaluationRepository: PortfolioEvaluationRepository,
        private readonly portfolioExposureRepository: PortfolioExposureRepository,
        private readonly portfolioStressTestRepository: PortfolioStressTestRepository,
        private readonly aiService: AiService,
        private readonly portfolioClient: PortfolioClient
    ) {}

    async createRun(
        input: CreateEvaluationRunInput,
        authenticatedUserId: string,
        authorization: string
    ): Promise<EvaluationRun> {

        if (
            !input ||
            typeof input.portfolioId !== "string" ||
            input.portfolioId.trim().length === 0
        ) {
            throw new AppError(400, "portfolioId is required");
        }

        const portfolioId = input.portfolioId.trim();

        const portfolio = await this.portfolioClient.getOwnedPortfolio(
            portfolioId,
            authorization
        );

        if (
            portfolio.id !== portfolioId ||
            portfolio.userId !== authenticatedUserId
        ) {
            throw new AppError(404, "Portfolio not found");
        }

        const run = await this.evaluationRunRepository.save(
            this.evaluationRunRepository.create({
                portfolioId,
                userId: authenticatedUserId,
                inputSnapshot: input.inputSnapshot,
                status: EvaluationRunStatus.PENDING
            })
        );

        await this.saveEvaluation(
            run.id,
            input.evaluation
        );

        if (input.runAi) {
            return this.generateAdvisory(run.id);
        }

        const updatedRun = await this.evaluationRunRepository.update(
            run.id,
            {
                status: EvaluationRunStatus.COMPLETED,
                completedAt: new Date()
            }
        );

        return this.getRequiredRun(updatedRun?.id ?? run.id);
    }

    async getRun(
        id: string
    ): Promise<EvaluationRun> {

        return this.getRequiredRun(id);
    }

    async listRuns(
        page = 1,
        pageSize = 25
    ): Promise<EvaluationRunPage> {

        const skip = (page - 1) * pageSize;
        const [
            data,
            total
        ] = await this.evaluationRunRepository.findPaginatedDetailed(
            skip,
            pageSize
        );

        return {
            data,
            total,
            page,
            pageSize
        };
    }

    async listRunsByPortfolio(
        portfolioId: string,
        page = 1,
        pageSize = 25
    ): Promise<EvaluationRunPage> {

        const skip = (page - 1) * pageSize;
        const [
            data,
            total
        ] = await this.evaluationRunRepository.findByPortfolioId(
            portfolioId,
            skip,
            pageSize
        );

        return {
            data,
            total,
            page,
            pageSize
        };
    }

    async generateAdvisory(
        id: string
    ): Promise<EvaluationRun> {

        const run = await this.getRequiredRun(id);
        const context = this.toEvaluationContext(run);

        try {
            const advisory = await this.aiService.generateAdvisory(context);

            await this.evaluationRunRepository.update(
                run.id,
                {
                    status: EvaluationRunStatus.COMPLETED,
                    aiAdvisory: advisory as unknown as Record<string, unknown>,
                    completedAt: new Date(),
                    errorMessage: undefined
                }
            );

            return this.getRequiredRun(run.id);
        } catch (error) {
            await this.evaluationRunRepository.update(
                run.id,
                {
                    status: EvaluationRunStatus.FAILED,
                    errorMessage: error instanceof Error ? error.message : "AI advisory generation failed"
                }
            );

            throw error;
        }
    }

    async deleteRun(
        id: string
    ): Promise<void> {

        await this.getRequiredRun(id);
        await this.evaluationRunRepository.delete(id);
    }

    private async saveEvaluation(
        runId: string,
        context: EvaluationContext
    ): Promise<void> {

        const evaluation = await this.portfolioEvaluationRepository.save(
            this.portfolioEvaluationRepository.create({
                runId,
                totalValue: context.totalValue,
                riskScore: context.riskScore,
                volatilityScore: context.volatilityScore,
                concentrationRisk: context.concentrationRisk,
                diversificationScore: context.diversificationScore
            })
        ) as PortfolioEvaluation;

        const exposures = [
            ...this.toExposureEntities(
                evaluation.id,
                PortfolioExposureType.COUNTRY,
                context.countryExposure
            ),
            ...this.toExposureEntities(
                evaluation.id,
                PortfolioExposureType.INDUSTRY,
                context.industryExposure
            ),
            ...this.toExposureEntities(
                evaluation.id,
                PortfolioExposureType.ASSET_CLASS,
                context.assetClassExposure
            )
        ];

        const stressTests = context.stressTests.map((stressTest) =>
            this.portfolioStressTestRepository.create({
                evaluationId: evaluation.id,
                scenario: stressTest.scenario,
                lossPercent: stressTest.lossPercent
            })
        );

        await Promise.all([
            exposures.length > 0
                ? this.portfolioExposureRepository.save(exposures as PortfolioExposure[])
                : Promise.resolve(),
            stressTests.length > 0
                ? this.portfolioStressTestRepository.save(stressTests as PortfolioStressTest[])
                : Promise.resolve()
        ]);
    }

    private toExposureEntities(
        evaluationId: string,
        type: PortfolioExposureType,
        exposures: Exposure[]
    ) {

        return exposures.map((exposure) =>
            this.portfolioExposureRepository.create({
                evaluationId,
                type,
                name: exposure.name,
                weight: exposure.weight
            })
        );
    }

    private toEvaluationContext(
        run: EvaluationRun
    ): EvaluationContext {

        if (!run.evaluation) {
            throw new AppError(
                409,
                "Evaluation run has no computed portfolio evaluation"
            );
        }

        return {
            portfolioId: run.portfolioId,
            totalValue: run.evaluation.totalValue,
            riskScore: run.evaluation.riskScore,
            volatilityScore: run.evaluation.volatilityScore,
            concentrationRisk: run.evaluation.concentrationRisk,
            diversificationScore: run.evaluation.diversificationScore,
            countryExposure: this.toExposureContext(
                run.evaluation.exposures,
                PortfolioExposureType.COUNTRY
            ),
            industryExposure: this.toExposureContext(
                run.evaluation.exposures,
                PortfolioExposureType.INDUSTRY
            ),
            assetClassExposure: this.toExposureContext(
                run.evaluation.exposures,
                PortfolioExposureType.ASSET_CLASS
            ),
            stressTests: run.evaluation.stressTests.map((stressTest): StressTest => ({
                scenario: stressTest.scenario,
                lossPercent: stressTest.lossPercent
            }))
        };
    }

    private toExposureContext(
        exposures: PortfolioExposure[],
        type: PortfolioExposureType
    ): Exposure[] {

        return exposures
            .filter((exposure) => exposure.type === type)
            .map((exposure) => ({
                name: exposure.name,
                weight: exposure.weight
            }));
    }

    private async getRequiredRun(
        id: string
    ): Promise<EvaluationRun> {

        const run = await this.evaluationRunRepository.findDetailedById(id);

        if (!run) {
            throw new AppError(
                404,
                "Evaluation run not found"
            );
        }

        return run;
    }
}
