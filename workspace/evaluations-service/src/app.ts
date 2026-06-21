import compression from "compression";
//It enables Cross-Origin Resource Sharing (CORS), 
//a security mechanism that allows your server to accept API
//requests from web applications hosted on different domains.
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { EvaluationController } from "./controllers/evaluation.controller";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/not-found.middleware";
import { requestContext } from "./middlewares/request-context.middleware";
import { buildEvaluationRouter } from "./routes/evaluation.routes";

export interface AppDependencies {
  evaluationController: EvaluationController;
}

export function buildApp({
  evaluationController
}: AppDependencies) {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "1mb" }));
  app.use(compression());
  app.use(cors());
  app.use(helmet());
  app.use(requestContext);

  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      service: "evaluations-service"
    });
  });

  app.use(
    "/evaluations",
    buildEvaluationRouter(evaluationController)
  );

  app.use("*", notFoundHandler);
  app.use(errorHandler);

  return app;
}
