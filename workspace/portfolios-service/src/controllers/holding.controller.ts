// holding.controller.ts
import { Request, Response, NextFunction } from "express";
import { HoldingService } from "../services/holding.service";
import { PortfolioService } from "../services/portfolio.service";
import { CreateHoldingDto } from "../dtos/create-holding.dto";
import { UpdateHoldingDto } from "../dtos/update-holding.dto";
import { AppError } from "../utils/appError";

export class HoldingController {
  constructor(
    private readonly holdingService: HoldingService,
    private readonly portfolioService: PortfolioService,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { portfolioId } = req.params;
      const userId = req.user!.publicId;

      // ownership check — 404s if the portfolio doesn't exist OR isn't theirs
      await this.portfolioService.getOwnedById(portfolioId, userId);

      const dto: CreateHoldingDto = { ...req.body, portfolioId };
      const holding = await this.holdingService.create(dto);
      res.status(201).json(holding);
    } catch (err) {
      next(err);
    }
  };

  findByPortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { portfolioId } = req.params;
      const userId = req.user!.publicId;

      await this.portfolioService.getOwnedById(portfolioId, userId);

      const holdings = await this.holdingService.listHoldingDetailsByPortfolioId(portfolioId);
      res.status(200).json(holdings);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { portfolioId, id } = req.params;
      const userId = req.user!.publicId;

      await this.portfolioService.getOwnedById(portfolioId, userId);

      const holding = await this.holdingService.getById(id);
      if (!holding || holding.portfolioId !== portfolioId) {
        // same 404-for-everything pattern — don't reveal whether the
        // holding exists under a different portfolio
        throw new AppError(404, "Holding not found");
      }
      res.status(200).json(holding);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { portfolioId, id } = req.params;
      const userId = req.user!.publicId;

      await this.portfolioService.getOwnedById(portfolioId, userId);

      const existing = await this.holdingService.getById(id);
      if (!existing || existing.portfolioId !== portfolioId) {
        throw new AppError(404, "Holding not found");
      }

      const dto: UpdateHoldingDto = req.body;
      const holding = await this.holdingService.update(id, dto);
      res.status(200).json(holding);
    } catch (err) {
      next(err);
    }
  };

  reduceQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { portfolioId, id } = req.params;
      const userId = req.user!.publicId;
      const { sellQuantity } = req.body;

      await this.portfolioService.getOwnedById(portfolioId, userId);

      const existing = await this.holdingService.getById(id);
      if (!existing || existing.portfolioId !== portfolioId) {
        throw new AppError(404, "Holding not found");
      }

      const holding = await this.holdingService.reduceQuantity(id, sellQuantity);
      res.status(200).json(holding);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { portfolioId, id } = req.params;
      const userId = req.user!.publicId;

      await this.portfolioService.getOwnedById(portfolioId, userId);

      const existing = await this.holdingService.getById(id);
      if (!existing || existing.portfolioId !== portfolioId) {
        throw new AppError(404, "Holding not found");
      }

      await this.holdingService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}