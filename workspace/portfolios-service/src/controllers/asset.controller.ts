import { Request, Response, NextFunction } from "express";
import { AssetService } from "../services/asset.service";
import { CreateAssetDto } from "../dtos/create-asset.dto";
import { UpdateAssetDto } from "../dtos/update-asset.dto";

export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateAssetDto = req.body;
      const asset = await this.assetService.create(dto);
      res.status(201).json(asset);
    } catch (err) {
      next(err);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 25;
      const assetClass = req.query.assetClass as string | undefined;

      const result = assetClass
        ? await this.assetService.findByClass(assetClass, page, pageSize)
        : await this.assetService.findByClass("" /* placeholder */, page, pageSize);
      // see note below — findAll without a class filter isn't implemented in AssetService yet

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const asset = await this.assetService.getById(req.params.id);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.status(200).json(asset);
    } catch (err) {
      next(err);
    }
  };

  findBySymbol = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const asset = await this.assetService.findBySymbol(req.params.symbol);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.status(200).json(asset);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: UpdateAssetDto = req.body;
      const asset = await this.assetService.update(req.params.userId, dto);
      res.status(200).json(asset);
    } catch (err) {
      next(err);
    }
  };

  updatePrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { price } = req.body;
      const asset = await this.assetService.updatePrice(req.params.userId, price);
      res.status(200).json(asset);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.assetService.delete(req.params.userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}