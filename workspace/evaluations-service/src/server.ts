import { AiService } from "./ai/services/ai.service";
import { PortfolioClient } from "./clients/portfolio.client";
import { buildApp } from "./app";
import { env } from "./config/env";
import { initializeDatabase, AppDataSource } from "./config/database";
import { EvaluationController } from "./controllers/evaluation.controller";
import { EvaluationRunRepository } from "./repositories/evaluation-run.repository";
import { PortfolioEvaluationRepository } from "./repositories/portfolio-evaluation.repository";
import { PortfolioExposureRepository } from "./repositories/portfolio-exposure.repository";
import { PortfolioStressTestRepository } from "./repositories/portfolio-stress-test.repository";
import { EvaluationService } from "./services/evaluation.service";



async function bootstrap() {
  await initializeDatabase();

  const evaluationRunRepository = new EvaluationRunRepository(AppDataSource);
  const portfolioEvaluationRepository = new PortfolioEvaluationRepository(AppDataSource);
  const portfolioExposureRepository = new PortfolioExposureRepository(AppDataSource);
  const portfolioStressTestRepository = new PortfolioStressTestRepository(AppDataSource);

  const aiService = new AiService();
  const portfolioClient = new PortfolioClient();
  const evaluationService = new EvaluationService(
    evaluationRunRepository,
    portfolioEvaluationRepository,
    portfolioExposureRepository,
    portfolioStressTestRepository,
    aiService,
    portfolioClient
  );
  const evaluationController = new EvaluationController(evaluationService);

  const app = buildApp({
    evaluationController
  });

  app.listen(env.PORT, () => {
    console.log(`Evaluations service listening on port ${env.PORT} - portfolio estimator app`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to bootstrap evaluations service", error);
  process.exit(1);
});
