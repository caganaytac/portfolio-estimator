import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "./config.js";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing Authorization header" });

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  if (!config.apiKey) return next();
  const key = req.headers["x-api-key"];
  if (key !== config.apiKey) return res.status(403).json({ error: "Invalid API key" });
  next();
}
