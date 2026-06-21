import type { EvaluationContext } from "../types/agent.types";

/**
 * Builds the canonical context object consumed by all AI agents.
 *
 * The builder intentionally does not calculate portfolio metrics. It only
 * normalizes an already evaluated portfolio payload into the AI contract.
 */
export class AdvisoryContextBuilder {

    build(
        evaluation: EvaluationContext
    ): EvaluationContext {

        return {
            portfolioId: evaluation.portfolioId,
            totalValue: evaluation.totalValue,
            riskScore: evaluation.riskScore,
            volatilityScore: evaluation.volatilityScore,
            concentrationRisk: evaluation.concentrationRisk,
            diversificationScore: evaluation.diversificationScore,
            countryExposure: evaluation.countryExposure,
            industryExposure: evaluation.industryExposure,
            assetClassExposure: evaluation.assetClassExposure,
            stressTests: evaluation.stressTests
        };
    }
}
