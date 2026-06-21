process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-access-token-secret";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-token-secret-at-least-32-characters";
process.env.JWT_EXPIRES_IN = "15m";
process.env.REFRESH_TOKEN_TTL_SECONDS = "604800";
process.env.BCRYPT_ROUNDS = "8";
process.env.PASSWORD_MIN_LENGTH = "8";

require("reflect-metadata");

