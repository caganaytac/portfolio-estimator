// src/middleware/jwtAuth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

export interface JwtPayload {
  sub: string;
  role: string;
  type: "access" | "refresh";
  iat: number;
  exp: number;
}

export function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(401, "Missing or invalid Authorization header"));
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (payload.type !== "access") {
      return next(new AppError(401, "Invalid token type"));
    }

    req.user = { publicId: payload.sub, role: payload.role };
    console.log(req.user);
    next();
  } catch (err) {
    return next(new AppError(401, "Invalid or expired token"));
  }
}