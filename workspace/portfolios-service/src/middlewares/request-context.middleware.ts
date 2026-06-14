import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";

export function requestContext(req: Request, _res: Response, next: NextFunction) {
  req.id = req.id ?? randomUUID();
  next();
}

