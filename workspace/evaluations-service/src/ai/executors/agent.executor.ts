import { OpenAIExecutor } from "./openai.executor";

/**
 * Generic agent execution layer.
 *
 * Converts the evaluation context
 * into a prompt and sends it to OpenAI.
 *
 * Every agent uses this executor.
 */
export class AgentExecutor {

    constructor(
        private readonly openai: OpenAIExecutor
    ) {}

    /**
     * Executes an agent.
     *
     * @param systemPrompt Agent instructions
     * @param context Portfolio evaluation payload
     *
     * @returns Raw AI response
     */
    async run(
        systemPrompt: string,
        context: object
    ): Promise<string> {

        return this.openai.complete(
            systemPrompt,

            JSON.stringify(
                context,
                null,
                2
            )
        );
    }
}