/**
 * Represents a portfolio exposure entry.
 *
 * Examples:
 * - Country Exposure: US = 72%
 * - Industry Exposure: Technology = 60%
 * - Asset Class Exposure: Stocks = 85%
 */
export interface Exposure {
    name: string;
    weight: number;
}

/**
 * Result of a stress test scenario.
 *
 * Example:
 * EQUITY_CRASH => -32%
 */
export interface StressTest {
    scenario: string;
    lossPercent: number;
}

/**
 * Canonical portfolio evaluation payload.
 *
 * This is the ONLY object that AI agents receive.
 *
 * IMPORTANT:
 * Agents must NEVER calculate metrics.
 * They only interpret this evaluation context.
 */
export interface EvaluationContext {

    portfolioId: string;

    totalValue: number;

    riskScore: number;
    volatilityScore: number;
    concentrationRisk: number;
    diversificationScore: number;

    countryExposure: Exposure[];
    industryExposure: Exposure[];
    assetClassExposure: Exposure[];

    stressTests: StressTest[];
}

/**
 * Base contract implemented by every AI agent.
 *
 * Each agent receives the same evaluation context
 * and returns its own specialized analysis.
 */
export interface Agent<TOutput> {

    execute(
        context: EvaluationContext
    ): Promise<TOutput>;
}