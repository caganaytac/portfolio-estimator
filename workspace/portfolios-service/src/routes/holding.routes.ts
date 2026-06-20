// holding.routes.ts
import { Router } from "express";
import { jwtAuth } from "../middlewares/jwt-auth.middleware";
import { HoldingController } from "../controllers/holding.controller";

export const buildHoldingRouter = (controller: HoldingController) => {
  const router = Router({ mergeParams: true }); // needed to read :portfolioId from the parent router. Thus holding.routes can see the params of asset / portfolio routers

  router.get("/", jwtAuth, controller.findByPortfolio);
  router.get("/:id", jwtAuth, controller.getById);

  router.post("/create", jwtAuth, controller.create);
  router.patch("/update/:id", jwtAuth, controller.update);
  router.patch("/:id/reduce", jwtAuth, controller.reduceQuantity);
  router.delete("/:id", jwtAuth, controller.delete);

  return router;
};