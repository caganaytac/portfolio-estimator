import { AGENT_CONFIG } from "../config/agents.config";
import { AgentExecutor } from "../executors/agent.executor";
import {
    parsePortfolioAdvisorResponse,
    PORTFOLIO_ADVISOR_RESPONSE_FORMAT
} from "../schemas/advisory-response.schema";
import type { Agent, EvaluationContext } from "../types/agent.types";
import type { PortfolioAdvisorResult } from "../types/advisory.types";

export class PortfolioAdvisorAgent implements Agent<PortfolioAdvisorResult> {

    constructor(
        private readonly executor: AgentExecutor
    ) {}

    async execute(
        context: EvaluationContext
    ): Promise<PortfolioAdvisorResult> {

        const rawResponse = await this.executor.run(
            this.systemPrompt,
            context
        );

        return parsePortfolioAdvisorResponse(rawResponse);
    }

    private get systemPrompt(): string {

        return [
            AGENT_CONFIG.portfolioAdvisor.systemPrompt,
            PORTFOLIO_ADVISOR_RESPONSE_FORMAT
        ].join("\n");
    }
}
