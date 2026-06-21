import { z } from "zod";
import type {
    AdvisoryResponse,
    PortfolioAdvisorResult
} from "../types/advisory.types";
import { extractJsonObject } from "./json-response.schema";

export const PORTFOLIO_ADVISOR_RESPONSE_FORMAT = `

Return only valid JSON with this exact shape:
{
  "summary": "short portfolio quality summary",
  "diversificationInsights": ["diversification insight based only on provided data"],
  "recommendations": ["portfolio improvement recommendation based only on provided data"]
}
`;

export const SYNTHESIZER_RESPONSE_FORMAT = `

Return only valid JSON with this exact shape:
{
  "summary": "executive summary of all agent findings",
  "riskAnalysis": "risk analysis summary",
  "diversificationAnalysis": "diversification analysis summary",
  "macroInsights": "macro insight summary",
  "taxInsights": "tax insight summary",
  "recommendations": ["combined recommendation"],
  "warnings": ["combined warning"]
}
`;

const portfolioAdvisorResponseSchema = z.object({
    summary: z.string().min(1),
    diversificationInsights: z.array(z.string()),
    recommendations: z.array(z.string())
});

const advisoryResponseSchema = z.object({
    summary: z.string().min(1),
    riskAnalysis: z.string().min(1),
    diversificationAnalysis: z.string().min(1),
    macroInsights: z.string().min(1),
    taxInsights: z.string().min(1),
    recommendations: z.array(z.string()),
    warnings: z.array(z.string())
});

export function parsePortfolioAdvisorResponse(
    rawResponse: string
): PortfolioAdvisorResult {

    const parsedJson = JSON.parse(
        extractJsonObject(
            rawResponse,
            "Portfolio Advisor"
        )
    );

    return portfolioAdvisorResponseSchema.parse(parsedJson) as PortfolioAdvisorResult;
}

export function parseAdvisoryResponse(
    rawResponse: string
): AdvisoryResponse {

    const parsedJson = JSON.parse(
        extractJsonObject(
            rawResponse,
            "Synthesizer"
        )
    );

    return advisoryResponseSchema.parse(parsedJson) as AdvisoryResponse;
}
