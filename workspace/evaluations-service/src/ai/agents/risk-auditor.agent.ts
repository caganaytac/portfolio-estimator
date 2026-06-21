import { AGENT_CONFIG } from "../config/agents.config";
import { AgentExecutor } from "../executors/agent.executor";
import {
    parseRiskAuditResponse,
    RISK_AUDITOR_RESPONSE_FORMAT
} from "../schemas/risk-response.schema";
import type { Agent, EvaluationContext } from "../types/agent.types";
import type { RiskAuditResult } from "../types/advisory.types";

/**
 * Interprets precomputed portfolio risk metrics.
 *
 * The risk auditor must not calculate new metrics. It only explains the
 * evaluation context from a risk-management perspective and returns the typed
 * response expected by the advisory pipeline.
 */
export class RiskAuditorAgent implements Agent<RiskAuditResult> {

    constructor(
        private readonly executor: AgentExecutor
    ) {}

    async execute(
        context: EvaluationContext
    ): Promise<RiskAuditResult> {

        const rawResponse = await this.executor.run(
            this.systemPrompt,
            context
        );

        return parseRiskAuditResponse(rawResponse);
    }

    private get systemPrompt(): string {

        return [
            AGENT_CONFIG.riskAuditor.systemPrompt,
            RISK_AUDITOR_RESPONSE_FORMAT
        ].join("\n");
    }
}
