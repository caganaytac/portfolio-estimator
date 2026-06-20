import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  // jwtAuth must run before this — req.user won't exist otherwise
  if (!req.user) {
    return next(new AppError(401, "Authentication required"));
  }

  if (req.user.role !== "admin") {
    return next(new AppError(403, "Only admins can perform this action"));
  }

  next();
}