/* import express from "express";
import { authenticateJWT, requireApiKey, AuthenticatedRequest } from "./auth.js";
import { withMetrics } from "./metrics.js";
import { createServiceClient } from "./serviceClient.js";
import { config } from "./config.js";

const usersClient = createServiceClient(config.services.usersService as string);
const portfoliosClient = createServiceClient(config.services.portfoliosService as string);
const router = express.Router();

// Health check
router.get("/health", (_req, res) => res.json({ status: "ok", uptime: process.uptime() }));

// Metrics endpoint
router.get("/metrics", withMetrics("/metrics", async (_req, res) => {
  res.json({ message: "metrics ok" });
}));

// Users service (protected)
router.use(
  "/api/users",
  withMetrics("/api/users", async (req, res) => {
    await new Promise<void>((resolve) =>
      authenticateJWT(req, res, async () => {
        const path = req.originalUrl.replace(/^\/api\/users/, "") || "/";
        const opts = {
          method: req.method as any,
          url: path,
          data: req.body,
          headers: { ...req.headers, host: undefined },
          params: req.query,
        };
        const response = await usersClient.request(opts);
        res.status(response.status).json(response.data);
        resolve();
      })
    );
  })
);

// Products service (optional API key)
router.use(
  "/api/products",
  withMetrics("/api/products", async (req, res) => {
    await new Promise<void>((resolve) =>
      requireApiKey(req, res, async () => {
        const path = req.originalUrl.replace(/^\/api\/products/, "") || "/";
        const opts = {
          method: req.method as any,
          url: path,
          data: req.body,
          headers: { ...req.headers, host: undefined },
          params: req.query,
        };
        const response = await productsClient.request(opts);
        res.status(response.status).json(response.data);
        resolve();
      })
    );
  })
);

// Notifications service (protected)
router.use(
  "/api/notifications",
  withMetrics("/api/notifications", async (req, res) => {
    await new Promise<void>((resolve) =>
      authenticateJWT(req as AuthenticatedRequest, res, async () => {
        const path = req.originalUrl.replace(/^\/api\/notifications/, "") || "/";
        const opts = {
          method: req.method as any,
          url: path,
          data: req.body,
          headers: { ...req.headers, host: undefined },
          params: req.query,
        };
        const response = await notificationsClient.request(opts as any);
        res.status(response.status).json(response.data);
        resolve();
      })
    );
  })
);

export default router;
 */