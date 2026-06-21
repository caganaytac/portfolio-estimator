import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/appError";

interface AccessTokenPayload extends JwtPayload {
  sub: string;
  role: string;
  type: "access";
}

export function jwtAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError(401, "Missing or invalid Authorization header"));
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token || !env.JWT_SECRET) {
    return next(new AppError(401, "Invalid or expired access token"));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (
      typeof payload === "string" ||
      payload.type !== "access" ||
      typeof payload.sub !== "string" ||
      typeof payload.role !== "string"
    ) {
      return next(new AppError(401, "Invalid or expired access token"));
    }

    const accessToken = payload as AccessTokenPayload;
    req.user = {
      publicId: accessToken.sub,
      role: accessToken.role
    };

    return next();
  } catch {
    return next(new AppError(401, "Invalid or expired access token"));
  }
}
