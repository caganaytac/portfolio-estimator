export class GatewayError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly service?: string
  ) {
    super(message);
    this.name = "GatewayError";
  }
}
