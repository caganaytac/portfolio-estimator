import axios, { AxiosRequestConfig } from "axios";
import CircuitBreaker from "opossum";
import pino from "pino";

const logger = pino();

const defaultBreakerOptions = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
};

export function createServiceClient(baseURL: string) {
  const client = axios.create({ baseURL, timeout: 5000 });
  const breaker = new CircuitBreaker(
    (opts: AxiosRequestConfig) => client.request(opts),
    defaultBreakerOptions
  );

  breaker.fallback(() => ({
    status: 503,
    data: { error: "Service unavailable (circuit open)" },
  }));

  breaker.on("open", () => logger.warn({ baseURL }, "Circuit open"));
  breaker.on("close", () => logger.info({ baseURL }, "Circuit closed"));

  return {
    request: (opts: AxiosRequestConfig) => breaker.fire(opts),
  };
}
