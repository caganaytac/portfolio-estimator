import type { NextFunction, Request, Response } from "express";
import { EvaluationService } from "../services/evaluation.service";

export class EvaluationController {

    constructor(
        private readonly evaluationService: EvaluationService
    ) {}

    create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const run = await this.evaluationService.createRun(
                req.body,
                req.user!.publicId,
                req.headers.authorization!
            );
            res.status(201).json(run);
        } catch (error) {
            next(error);
        }
    };

    findAll = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const page = req.query.page ? Number(req.query.page) : 1;
            const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 25;

            const result = await this.evaluationService.listRuns(
                page,
                pageSize
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    findByPortfolio = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const page = req.query.page ? Number(req.query.page) : 1;
            const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 25;
            const { portfolioId } = req.params;

            const result = await this.evaluationService.listRunsByPortfolio(
                portfolioId,
                page,
                pageSize
            );

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { evaluationRunId } = req.params;
            const run = await this.evaluationService.getRun(evaluationRunId);
            res.status(200).json(run);
        } catch (error) {
            next(error);
        }
    };

    generateAdvisory = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { evaluationRunId } = req.params;
            const run = await this.evaluationService.generateAdvisory(evaluationRunId);
            res.status(200).json(run);
        } catch (error) {
            next(error);
        }
    };

    delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { evaluationRunId } = req.params;
            await this.evaluationService.deleteRun(evaluationRunId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
