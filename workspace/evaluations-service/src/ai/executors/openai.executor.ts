import OpenAI from "openai";
import { OPENAI_CONFIG } from "../config/openai";

/**
 * Thin wrapper around OpenAI.
 *
 * Benefits:
 * - Centralized API access
 * - Easier testing
 * - Easier model switching
 */
export class OpenAIExecutor {

    private readonly client: OpenAI;

    constructor() {

        this.client = new OpenAI({
            apiKey: OPENAI_CONFIG.apiKey
        });
    }

    /**
     * Executes a completion request.
     *
     * @param systemPrompt Agent instructions
     * @param userPrompt Portfolio evaluation payload
     *
     * @returns Raw model response
     */
    async complete(
        systemPrompt: string,
        userPrompt: string
    ): Promise<string> {

        const response =
            await this.client.chat.completions.create({
                model: OPENAI_CONFIG.model,

                temperature: 0.2,

                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: userPrompt
                    }
                ]
            });

        return (
            response.choices[0]?.message?.content ??
            ""
        );
    }
}