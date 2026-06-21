import { AGENT_CONFIG } from "../config/agents.config";
import { AgentExecutor } from "../executors/agent.executor";
import {
    parseAdvisoryResponse,
    SYNTHESIZER_RESPONSE_FORMAT
} from "../schemas/advisory-response.schema";
import type { EvaluationContext } from "../types/agent.types";
import type {
    AdvisoryResponse,
    MacroResult,
    PortfolioAdvisorResult,
    RiskAuditResult,
    TaxResult
} from "../types/advisory.types";

export interface SynthesizerInput {
    context: EvaluationContext;
    riskAudit: RiskAuditResult;
    macroAnalysis: MacroResult;
    taxAnalysis: TaxResult;
    portfolioAdvice: PortfolioAdvisorResult;
}

export class SynthesizerAgent {

    constructor(
        private readonly executor: AgentExecutor
    ) {}

    async execute(
        input: SynthesizerInput
    ): Promise<AdvisoryResponse> {

        const rawResponse = await this.executor.run(
            this.systemPrompt,
            input
        );

        return parseAdvisoryResponse(rawResponse);
    }

    private get systemPrompt(): string {

        return [
            AGENT_CONFIG.synthesizer.systemPrompt,
            SYNTHESIZER_RESPONSE_FORMAT
        ].join("\n");
    }
}
