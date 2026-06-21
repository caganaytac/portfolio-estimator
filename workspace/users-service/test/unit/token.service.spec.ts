import { describe, expect, it } from "@jest/globals";
import jwt from "jsonwebtoken";
import { env } from "../../src/config/env";
import { TokenService } from "../../src/services/token.service";

describe("TokenService", () => {
  const service = new TokenService();

  it("issues typed access and refresh tokens for the same subject", () => {
    const tokens = service.generateTokens("public-1", "admin");
    const access = service.verifyAccessToken(tokens.accessToken);
    const refresh = service.verifyRefreshToken(tokens.refreshToken);

    expect(access).toMatchObject({ sub: "public-1", role: "admin", type: "access" });
    expect(refresh).toMatchObject({ sub: "public-1", role: "admin", type: "refresh" });
    expect(tokens.expiresIn).toBe(env.JWT_EXPIRES_IN);
  });

  it("never accepts an access token as a refresh token", () => {
    const { accessToken } = service.generateTokens("public-1", "user");

    expect(() => service.verifyRefreshToken(accessToken)).toThrow(
      expect.objectContaining({ statusCode: 401, message: "Invalid refresh token" })
    );
  });

  it("never accepts a refresh token as an access token", () => {
    const { refreshToken } = service.generateTokens("public-1", "user");

    expect(() => service.verifyAccessToken(refreshToken)).toThrow(
      expect.objectContaining({ statusCode: 401, message: "Invalid access token" })
    );
  });

  it("rejects tokens signed with another secret", () => {
    const forged = jwt.sign(
      { sub: "public-1", role: "admin", type: "access" },
      "another-secret"
    );

    expect(() => service.verifyAccessToken(forged)).toThrow(
      expect.objectContaining({ statusCode: 401 })
    );
  });
});
