export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 8080,
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  apiKey: process.env.API_KEY,
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS
      ? Number(process.env.RATE_LIMIT_WINDOW_MS)
      : 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX ? Number(process.env.RATE_LIMIT_MAX) : 200,
  },
  services: {
  users: process.env.USERS_URL || "http://users-service:3001",                         // Identity lifecycle, credential storage, role assignments, audit events
  portfolios: process.env.PORTFOLIOS_URL || "http://portfolios-service:3005",          // Portfolio creation, allocation, tracking, portfolio optimization
},

};
