import { z } from "zod";
import type { TaxResult } from "../types/advisory.types";
import { extractJsonObject } from "./json-response.schema";

export const TAX_OPTIMIZER_RESPONSE_FORMAT = `

Return only valid JSON with this exact shape:
{
  "observations": ["tax observation based only on provided data"],
  "recommendations": ["tax-efficiency recommendation based only on provided data"]
}
`;

const taxResponseSchema = z.object({
    observations: z.array(z.string()),
    recommendations: z.array(z.string())
});

export function parseTaxResponse(
    rawResponse: string
): TaxResult {

    const parsedJson = JSON.parse(
        extractJsonObject(
            rawResponse,
            "Tax Optimizer"
        )
    );

    return taxResponseSchema.parse(parsedJson) as TaxResult;
}
