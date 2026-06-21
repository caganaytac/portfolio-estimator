import { buildApp } from "./app.js";
import { config } from "./config.js";

export function startServer() {
  const app = buildApp();
  const server = app.listen(config.port);

  const shutdown = () => {
    server.close((error) => {
      if (error) {
        process.exitCode = 1;
      }
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  return server;
}
