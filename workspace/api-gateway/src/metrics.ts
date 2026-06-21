import type { NextFunction, Request, Response } from "express";
import client from "prom-client";

client.collectDefaultMetrics();

const requestDuration = new client.Histogram({
  name: "gateway_http_request_duration_seconds",
  help: "API gateway request duration in seconds",
  labelNames: ["method", "route", "status"] as const,
  buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});

function routeLabel(req: Request): string {
  const segments = req.path.split("/").filter(Boolean).slice(0, 2);
  return segments.length > 0 ? `/${segments.join("/")}` : "/";
}

export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const end = requestDuration.startTimer({
    method: req.method,
    route: routeLabel(req)
  });

  res.once("finish", () => {
    end({ status: String(res.statusCode) });
  });

  next();
}

export async function metricsHandler(_req: Request, res: Response) {
  res.setHeader("content-type", client.register.contentType);
  res.end(await client.register.metrics());
}
