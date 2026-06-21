import { z } from "zod";
import type { RiskAuditResult } from "../types/advisory.types";
import { extractJsonObject } from "./json-response.schema";

export const RISK_AUDITOR_RESPONSE_FORMAT = `

Return only valid JSON with this exact shape:
{
  "riskSummary": "short interpretation of the portfolio risk",
  "vulnerabilities": ["risk vulnerability based only on provided data"],
  "warnings": ["important warning based only on provided data"],
  "riskLevel": "LOW" | "MEDIUM" | "HIGH"
}
`;

const riskResponseSchema = z.object({
    riskSummary: z.string().min(1),
    vulnerabilities: z.array(z.string()),
    warnings: z.array(z.string()),
    riskLevel: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH"
    ])
});

export function parseRiskAuditResponse(
    rawResponse: string
): RiskAuditResult {

    const parsedJson = JSON.parse(
        extractJsonObject(
            rawResponse,
            "Risk Auditor"
        )
    );

    return riskResponseSchema.parse(parsedJson) as RiskAuditResult;
}
