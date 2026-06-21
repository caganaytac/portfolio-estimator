import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse
} from "axios";
import { config } from "./config.js";
import { GatewayError } from "./errors.js";

export interface ServiceClient {
  readonly name: string;
  request(options: AxiosRequestConfig): Promise<AxiosResponse<ArrayBuffer>>;
}

export function createServiceClient(
  name: string,
  baseURL: string
): ServiceClient {
  const client = axios.create({
    baseURL,
    timeout: config.requestTimeoutMs,
    maxRedirects: 0,
    maxBodyLength: 2 * 1024 * 1024,
    maxContentLength: 10 * 1024 * 1024,
    responseType: "arraybuffer",
    validateStatus: () => true
  });

  return {
    name,
    async request(options) {
      try {
        return await client.request<ArrayBuffer>(options);
      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.code === "ECONNABORTED" || axiosError.code === "ETIMEDOUT") {
          throw new GatewayError(504, `${name} service timed out`, name);
        }

        throw new GatewayError(502, `${name} service is unavailable`, name);
      }
    }
  };
}
