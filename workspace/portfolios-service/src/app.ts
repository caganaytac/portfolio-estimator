// app.ts (portfolios-service)
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { AssetController } from "./controllers/asset.controller";
import { PortfolioController } from "./controllers/portfolio.controller";
import { HoldingController } from "./controllers/holding.controller";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/not-found.middleware";
import { requestContext } from "./middlewares/request-context.middleware";
import { buildAssetRouter } from "./routes/asset.routes";
import { buildPortfolioRouter } from "./routes/portfolio.routes";

export interface AppDependencies {
  assetController: AssetController;
  portfolioController: PortfolioController;
  holdingController: HoldingController;
}

export function buildApp({ assetController, portfolioController, holdingController }: AppDependencies) {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "1mb" }));
  app.use(compression());
  app.use(cors());
  app.use(helmet());
  app.use(requestContext);

  app.use("/assets", buildAssetRouter(assetController));

  // holdingController is passed in here, not mounted separately —
  // buildPortfolioRouter nests it under /portfolios/:portfolioId/holdings internally
  app.use("/portfolios", buildPortfolioRouter(portfolioController, holdingController));

  app.use("*", notFoundHandler);
  app.use(errorHandler);

  return app;
}