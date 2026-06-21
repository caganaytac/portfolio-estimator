import { AGENT_CONFIG } from "../config/agents.config";
import { AgentExecutor } from "../executors/agent.executor";
import {
    MACRO_ANALYST_RESPONSE_FORMAT,
    parseMacroResponse
} from "../schemas/macro-response.schema";
import type { Agent, EvaluationContext } from "../types/agent.types";
import type { MacroResult } from "../types/advisory.types";

export class MacroAnalystAgent implements Agent<MacroResult> {

    constructor(
        private readonly executor: AgentExecutor
    ) {}

    async execute(
        context: EvaluationContext
    ): Promise<MacroResult> {

        const rawResponse = await this.executor.run(
            this.systemPrompt,
            context
        );

        return parseMacroResponse(rawResponse);
    }

    private get systemPrompt(): string {

        return [
            AGENT_CONFIG.macroAnalyst.systemPrompt,
            MACRO_ANALYST_RESPONSE_FORMAT
        ].join("\n");
    }
}
