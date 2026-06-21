import { AGENT_CONFIG } from "../config/agents.config";
import { AgentExecutor } from "../executors/agent.executor";
import {
    parseTaxResponse,
    TAX_OPTIMIZER_RESPONSE_FORMAT
} from "../schemas/tax-response.schema";
import type { Agent, EvaluationContext } from "../types/agent.types";
import type { TaxResult } from "../types/advisory.types";

export class TaxOptimizerAgent implements Agent<TaxResult> {

    constructor(
        private readonly executor: AgentExecutor
    ) {}

    async execute(
        context: EvaluationContext
    ): Promise<TaxResult> {

        const rawResponse = await this.executor.run(
            this.systemPrompt,
            context
        );

        return parseTaxResponse(rawResponse);
    }

    private get systemPrompt(): string {

        return [
            AGENT_CONFIG.taxOptimizer.systemPrompt,
            TAX_OPTIMIZER_RESPONSE_FORMAT
        ].join("\n");
    }
}
