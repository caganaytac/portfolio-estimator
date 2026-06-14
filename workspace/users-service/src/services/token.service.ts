import jwt, { SignOptions, Secret, JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/appError";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

interface AccessTokenPayload extends JwtPayload {
  sub: string;
  role: string;
  type: "access";
}

interface RefreshTokenPayload extends JwtPayload {
  sub: string;
  type: "refresh";
}

export class TokenService {
  generateTokens(publicId: string, role: string): AuthTokens {
    const accessPayload: AccessTokenPayload = {
      sub: publicId,
      role,
      type: "access",
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: publicId,
      type: "refresh",
    };

    const accessToken = jwt.sign(accessPayload, env.JWT_SECRET as Secret, {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    });

    // Prefer a dedicated secret for refresh tokens if you have one in env.
    // Falls back to JWT_SECRET if REFRESH_TOKEN_SECRET isn't configured.
    const refreshToken = jwt.sign(
      refreshPayload,
      (env.REFRESH_TOKEN_SECRET ?? env.JWT_SECRET) as Secret,
      { expiresIn: env.REFRESH_TOKEN_TTL_SECONDS }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  /**
   * Verifies a refresh token: checks signature, expiry, and that it's
   * actually a refresh token (not an access token reused here).
   * Throws AppError(401) on any failure.
   */
  verifyRefreshToken(token: string): RefreshTokenPayload {
    let payload: JwtPayload | string;

    try {
      payload = jwt.verify(token, (env.REFRESH_TOKEN_SECRET ?? env.JWT_SECRET) as Secret);
    } catch {
      throw new AppError(401, "Invalid refresh token");
    }

    if (typeof payload === "string" || payload.type !== "refresh" || !payload.sub) {
      throw new AppError(401, "Invalid refresh token");
    }

    return payload as RefreshTokenPayload;
  }

  /**
   * Verifies an access token: checks signature, expiry, and that it's
   * actually an access token. Use this in your auth middleware.
   */
  verifyAccessToken(token: string): AccessTokenPayload {
    let payload: JwtPayload | string;

    try {
      payload = jwt.verify(token, env.JWT_SECRET as Secret);
    } catch {
      throw new AppError(401, "Invalid access token");
    }

    if (typeof payload === "string" || payload.type !== "access" || !payload.sub || !payload.role) {
      throw new AppError(401, "Invalid access token");
    }

    return payload as AccessTokenPayload;
  }
}