import { Router } from "express";
import { authRoutePolicy, authenticateJWT } from "./auth.js";
import { config } from "./config.js";
import { metricsHandler } from "./metrics.js";
import { proxyTo } from "./proxy.js";
import {
  createServiceClient,
  type ServiceClient
} from "./serviceClient.js";

export interface GatewayClients {
  users: ServiceClient;
  portfolios: ServiceClient;
  evaluations: ServiceClient;
}

export function createGatewayClients(): GatewayClients {
  return {
    users: createServiceClient("users", config.services.users),
    portfolios: createServiceClient("portfolios", config.services.portfolios),
    evaluations: createServiceClient("evaluations", config.services.evaluations)
  };
}

export function buildGatewayRouter(
  clients: GatewayClients = createGatewayClients()
) {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      service: "api-gateway",
      uptimeSeconds: Math.floor(process.uptime())
    });
  });

  router.get("/metrics", metricsHandler);

  router.use(
    "/api/auth",
    authRoutePolicy,
    proxyTo(clients.users, "/api/auth", "/auth")
  );

  router.use(
    "/api/users",
    authenticateJWT,
    proxyTo(clients.users, "/api/users", "/users")
  );

  router.use(
    "/api/persons",
    authenticateJWT,
    proxyTo(clients.users, "/api/persons", "/persons")
  );

  router.use(
    "/api/corporates",
    authenticateJWT,
    proxyTo(clients.users, "/api/corporates", "/corporates")
  );

  router.use(
    "/api/portfolios",
    authenticateJWT,
    proxyTo(clients.portfolios, "/api/portfolios", "/portfolios")
  );

  router.use(
    "/api/assets",
    authenticateJWT,
    proxyTo(clients.portfolios, "/api/assets", "/assets")
  );

  router.use(
    "/api/evaluations",
    authenticateJWT,
    proxyTo(clients.evaluations, "/api/evaluations", "/evaluations")
  );

  return router;
}

export default buildGatewayRouter();
