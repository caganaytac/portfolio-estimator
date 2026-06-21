import { randomUUID } from "node:crypto";
import cors, { type CorsOptions } from "cors";
import express, {
  type NextFunction,
  type Request,
  type Response
} from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { config } from "./config.js";
import { GatewayError } from "./errors.js";
import { metricsMiddleware } from "./metrics.js";
import { buildGatewayRouter, type GatewayClients } from "./routes.js";

function corsOptions(): CorsOptions {
  if (config.corsOrigins.includes("*")) {
    return { origin: true };
  }

  return {
    origin(origin, callback) {
      if (!origin || config.corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    }
  };
}

export function buildApp(clients?: GatewayClients) {
  const app = express();

  app.disable("x-powered-by");

  if (config.trustProxy) {
    app.set("trust proxy", 1);
  }

  app.use((req, res, next) => {
    req.id = req.header("x-request-id") || randomUUID();
    res.setHeader("x-request-id", req.id);
    next();
  });
  app.use(helmet());
  app.use(cors(corsOptions()));
  app.use(express.json({ limit: config.bodyLimit }));
  app.use(express.urlencoded({ extended: false, limit: config.bodyLimit }));
  app.use(metricsMiddleware);
  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.use(buildGatewayRouter(clients));

  app.use((_req, res) => {
    res.status(404).json({ message: "Gateway route not found" });
  });

  app.use((
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (error instanceof GatewayError) {
      return res.status(error.statusCode).json({
        message: error.message,
        requestId: req.id
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      requestId: req.id
    });
  });

  return app;
}
