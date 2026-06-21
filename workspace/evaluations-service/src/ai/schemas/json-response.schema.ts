export function extractJsonObject(
    rawResponse: string,
    agentName: string
): string {

    const trimmed = rawResponse.trim();

    if (
        trimmed.startsWith("{") &&
        trimmed.endsWith("}")
    ) {
        return trimmed;
    }

    const match = trimmed.match(/\{[\s\S]*\}/);

    if (!match) {
        throw new Error(`${agentName} returned a non-JSON response.`);
    }

    return match[0];
}
