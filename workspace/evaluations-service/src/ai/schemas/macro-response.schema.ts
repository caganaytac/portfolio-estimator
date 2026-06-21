import { z } from "zod";
import type { MacroResult } from "../types/advisory.types";
import { extractJsonObject } from "./json-response.schema";

export const MACRO_ANALYST_RESPONSE_FORMAT = `

Return only valid JSON with this exact shape:
{
  "macroView": "short macro interpretation based only on provided data",
  "tacticalTilts": ["portfolio tilt suggestion based only on provided data"],
  "opportunities": ["macro opportunity based only on provided data"]
}
`;

const macroResponseSchema = z.object({
    macroView: z.string().min(1),
    tacticalTilts: z.array(z.string()),
    opportunities: z.array(z.string())
});

export function parseMacroResponse(
    rawResponse: string
): MacroResult {

    const parsedJson = JSON.parse(
        extractJsonObject(
            rawResponse,
            "Macro Analyst"
        )
    );

    return macroResponseSchema.parse(parsedJson) as MacroResult;
}
