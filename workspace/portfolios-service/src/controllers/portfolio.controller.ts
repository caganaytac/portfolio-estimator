// portfolio.controller.ts
import { Request, Response, NextFunction } from "express";
import { PortfolioService } from "../services/portfolio.service";
import { CreatePortfolioDto } from "../dtos/create-portfolio.dto";
import { UpdatePortfolioDto } from "../dtos/update-portfolio.dto";

export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.publicId;
      console.log(userId)
      const dto: CreatePortfolioDto = req.body;

      const portfolio = await this.portfolioService.createForUser(userId, dto);
      res.status(201).json(portfolio);
    } catch (err) {
      next(err);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.publicId;
      const page = req.query.page ? Number(req.query.page) : 1;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 25;

      const result = await this.portfolioService.findAllForUser(userId, page, pageSize);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // returns the full rollup view: holdings + totalValue/totalUnrealizedPnl/etc.
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.publicId;
      const { portfolioId } = req.params;

      const details = await this.portfolioService.getDetails(portfolioId, userId);
      res.status(200).json(details);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.publicId;
      const { portfolioId } = req.params;
      const dto: UpdatePortfolioDto = req.body;

      // confirms ownership before allowing the update — 404s if not found or not theirs
      await this.portfolioService.getOwnedById(portfolioId, userId);

      const updated = await this.portfolioService.update(portfolioId, dto);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.publicId;
      const { portfolioId } = req.params;

      // ownership check is already inside portfolioService.delete()
      await this.portfolioService.deleteForUser(portfolioId, userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}