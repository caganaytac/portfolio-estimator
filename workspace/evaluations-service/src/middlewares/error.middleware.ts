import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    console.warn("Known application error", { err, details: err.details });
    return res.status(err.statusCode).json({ message: err.message, details: err.details });
  }

  console.error("Unhandled error", err);
  return res.status(500).json({ message: "Internal Server Error" });
}
