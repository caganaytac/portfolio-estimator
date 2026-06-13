import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/user";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export class TokenService {
  generateTokens(user: User): AuthTokens {
    const payload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET as Secret, {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign(payload, env.JWT_SECRET as Secret, {
      expiresIn: env.REFRESH_TOKEN_TTL_SECONDS,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }
}

