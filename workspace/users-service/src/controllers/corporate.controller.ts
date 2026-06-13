import { NextFunction, Request, Response } from "express";
import { CorporateService } from "../services/corporate.service";

export class CorporateController {
  constructor(private readonly corporateService: CorporateService) {}

  createCorporate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const corporate = await this.corporateService.createCorporate(req.body);
      res.status(201).json(corporate);
    } catch (error) {
      next(error);
    }
  };

  getCorporate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const corporate = await this.corporateService.getCorporateByUserId(userId);
      if (!corporate) {
        return res.status(404).json({ message: "Corporate profile not found" });
      }
      res.json(corporate);
    } catch (error) {
      next(error);
    }
  };

  getCorporateDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const details = await this.corporateService.getCorporateDetails(userId);
      if (!details) return res.status(404).json({ message: "Corporate profile not found" });
      res.json(details);
    } catch (error) {
      next(error);
    }
  };

  getCorporateByPublicId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const publicId = req.params.publicId;
      const details = await this.corporateService.getCorporateDetailsByPublicId(publicId);
      if (!details) return res.status(404).json({ message: "Corporate profile not found" });
      res.json(details);
    } catch (error) {
      next(error);
    }
  };

  listCorporates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 25;
      res.json(await this.corporateService.listCorporates(page, pageSize));
    } catch (error) {
      next(error);
    }
  };

  updateCorporate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const updated = await this.corporateService.updateCorporate(userId, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  deleteCorporate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      await this.corporateService.deleteCorporate(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
