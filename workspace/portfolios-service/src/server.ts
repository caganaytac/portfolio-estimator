// server.ts
import { buildApp } from "./app";
import { env } from "./config/env";
import { initializeDatabase, AppDataSource } from "./config/database";

import { AssetRepository } from "./repositories/asset.repository";
import { PortfolioRepository } from "./repositories/portfolio.repository";
import { HoldingRepository } from "./repositories/holding.repository";

import { AssetService } from "./services/asset.service";
import { PortfolioService } from "./services/portfolio.service";
import { HoldingService } from "./services/holding.service";

import { AssetController } from "./controllers/asset.controller";
import { PortfolioController } from "./controllers/portfolio.controller";
import { HoldingController } from "./controllers/holding.controller";

async function bootstrap() {
  initializeDatabase();

  // repositories
  const assetRepository = new AssetRepository(AppDataSource);
  const portfolioRepository = new PortfolioRepository(AppDataSource);
  const holdingRepository = new HoldingRepository(AppDataSource);

  // services (note the dependency order: HoldingService needs AssetService,
  // PortfolioService needs HoldingService)
  const assetService = new AssetService(assetRepository);
  const holdingService = new HoldingService(holdingRepository, assetService);
  const portfolioService = new PortfolioService(portfolioRepository, holdingService);

  // controllers
  const assetController = new AssetController(assetService);
  const portfolioController = new PortfolioController(portfolioService);
  const holdingController = new HoldingController(holdingService, portfolioService);

  const app = buildApp({ portfolioController, assetController, holdingController });

  app.listen(env.PORT, () => {
    console.log(`Portfolios service listening on port ${env.PORT} - portfolio estimator app`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to bootstrap portfolios service", error);
  process.exit(1);
});