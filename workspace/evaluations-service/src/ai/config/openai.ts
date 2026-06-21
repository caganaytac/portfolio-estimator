import { env } from "../../config/env";

/**
 * OpenAI configuration.
 *
 * Centralizing these values prevents model names
 * from being scattered throughout the codebase.
 */
export const OPENAI_CONFIG = {

    /**
     * Model used by all AI agents.
     */
    model: env.OPENAI_MODEL,

    /**
     * OpenAI API key.
     */
    apiKey: env.OPENAI_API_KEY
};
