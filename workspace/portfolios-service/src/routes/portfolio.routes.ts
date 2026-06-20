// portfolio.routes.ts
import { Router } from "express";
import { jwtAuth } from "../middlewares/jwt-auth.middleware";
import { PortfolioController } from "../controllers/portfolio.controller";
import { HoldingController } from "../controllers/holding.controller";
import { buildHoldingRouter } from "./holding.routes";

export const buildPortfolioRouter = (
  controller: PortfolioController,
  holdingController: HoldingController,
) => {
  const router = Router();

  router.get("/", jwtAuth, controller.findAll);
  router.get("/:portfolioId", jwtAuth, controller.getById);

  router.post("/create", jwtAuth, controller.create);
  router.patch("/update/:portfolioId", jwtAuth, controller.update);
  router.delete("/delete/:portfolioId", jwtAuth, controller.delete);

  router.use("/:portfolioId/holdings", buildHoldingRouter(holdingController));

  return router;
};