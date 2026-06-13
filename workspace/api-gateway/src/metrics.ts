import client from "prom-client";
import { Request, Response } from "express";

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const requestDuration = new client.Histogram({
  name: "gateway_http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
});

export async function metricsHandler(_req: Request, res: Response) {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
}

export function withMetrics(
  route: string,
  handler: (req: Request, res: Response, next: any) => Promise<void> | void
) {
  return async (req: Request, res: Response, next: any) => {
    const end = requestDuration.startTimer({
      method: req.method,
      route,
    });
    try {
      await handler(req, res, next);
    } finally {
      end({ status: res.statusCode });
    }
  };
}
