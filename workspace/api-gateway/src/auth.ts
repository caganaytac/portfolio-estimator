import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "./config.js";

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  role: string;
  type: "access";
}

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const match = req.headers.authorization?.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({
      message: "Missing or invalid Authorization header"
    });
  }

  try {
    const payload = jwt.verify(match[1], config.jwtSecret, {
      algorithms: ["HS256"]
    });

    if (
      typeof payload === "string" ||
      payload.type !== "access" ||
      typeof payload.sub !== "string" ||
      typeof payload.role !== "string"
    ) {
      return res.status(401).json({ message: "Invalid or expired access token" });
    }

    req.user = payload as AccessTokenPayload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
}

export function authRoutePolicy(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const publicPostPaths = new Set([
    "/login",
    "/refresh",
    "/register/person",
    "/register/corporate"
  ]);

  if (req.method === "POST" && publicPostPaths.has(req.path)) {
    return next();
  }

  return authenticateJWT(req, res, next);
}
