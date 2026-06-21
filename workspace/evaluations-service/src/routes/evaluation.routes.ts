import { Router } from "express";
import { EvaluationController } from "../controllers/evaluation.controller";
import { jwtAuth } from "../middlewares/jwt-auth.middleware";

export const buildEvaluationRouter = (
    controller: EvaluationController
) => {
    const router = Router();

    router.get(
        "/",
        controller.findAll
    );

    router.get(
        "/portfolio/:portfolioId",
        controller.findByPortfolio
    );

    router.get(
        "/:evaluationRunId",
        controller.getById
    );

    router.post(
        "/",
        jwtAuth,
        controller.create
    );

    router.post(
        "/:evaluationRunId/advisory",
        controller.generateAdvisory
    );

    router.delete(
        "/:evaluationRunId",
        controller.delete
    );

    return router;
};
