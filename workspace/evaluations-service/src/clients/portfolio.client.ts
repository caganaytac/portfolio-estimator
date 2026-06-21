import { env } from "../config/env";
import { AppError } from "../utils/appError";

export interface PortfolioOwner {
  id: string;
  userId: string;
}

export class PortfolioClient {
  async getOwnedPortfolio(
    portfolioId: string,
    authorization: string
  ): Promise<PortfolioOwner> {
    let response: Response;

    try {
      const baseUrl = env.PORTFOLIOS_SERVICE_URL.replace(/\/+$/, "");

      response = await fetch(
        `${baseUrl}/portfolios/${encodeURIComponent(portfolioId)}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            authorization
          },
          signal: AbortSignal.timeout(env.PORTFOLIOS_SERVICE_TIMEOUT_MS)
        }
      );
    } catch {
      throw new AppError(502, "Portfolio service is unavailable");
    }

    if (response.status === 401) {
      throw new AppError(401, "Invalid or expired access token");
    }

    if (response.status === 403 || response.status === 404) {
      throw new AppError(404, "Portfolio not found");
    }

    if (!response.ok) {
      throw new AppError(502, "Portfolio service request failed");
    }

    const portfolio: unknown = await response.json();

    if (
      !portfolio ||
      typeof portfolio !== "object" ||
      !("id" in portfolio) ||
      typeof portfolio.id !== "string" ||
      !("userId" in portfolio) ||
      typeof portfolio.userId !== "string"
    ) {
      throw new AppError(502, "Portfolio service returned an invalid response");
    }

    return {
      id: portfolio.id,
      userId: portfolio.userId
    };
  }
}
