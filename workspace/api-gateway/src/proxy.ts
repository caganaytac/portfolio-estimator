import type { NextFunction, Request, Response } from "express";
import type { AxiosRequestConfig } from "axios";
import type { ServiceClient } from "./serviceClient.js";

const forwardedRequestHeaders = [
  "accept",
  "accept-language",
  "authorization",
  "content-type",
  "idempotency-key",
  "user-agent",
  "x-api-key"
] as const;

const forwardedResponseHeaders = [
  "content-disposition",
  "content-language",
  "content-type",
  "etag",
  "last-modified",
  "location",
  "retry-after"
] as const;

function requestHeaders(req: Request): Record<string, string> {
  const headers: Record<string, string> = {
    "x-request-id": req.id
  };

  for (const name of forwardedRequestHeaders) {
    const value = req.headers[name];

    if (typeof value === "string") {
      headers[name] = value;
    }
  }

  return headers;
}

function upstreamPath(
  originalUrl: string,
  gatewayPrefix: string,
  servicePrefix: string
): string {
  const pathname = originalUrl.split("?", 1)[0];
  const suffix = pathname.slice(gatewayPrefix.length);
  return `${servicePrefix}${suffix}` || "/";
}

export function proxyTo(
  client: ServiceClient,
  gatewayPrefix: string,
  servicePrefix: string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const options: AxiosRequestConfig = {
      method: req.method,
      url: upstreamPath(req.originalUrl, gatewayPrefix, servicePrefix),
      params: req.query,
      headers: requestHeaders(req)
    };

    if (req.method !== "GET" && req.method !== "HEAD" && req.body !== undefined) {
      options.data = req.body;
    }

    try {
      const response = await client.request(options);

      for (const name of forwardedResponseHeaders) {
        const value = response.headers[name];

        if (value !== undefined) {
          res.setHeader(name, String(value));
        }
      }

      res.status(response.status).send(Buffer.from(response.data));
    } catch (error) {
      next(error);
    }
  };
}
