import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import pino from "pino";
import rateLimit from "express-rate-limit";
import router from "./routes.js";
import { config } from "./config.js";

const logger = pino({ level: "info" });
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(router);

app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
  logger.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

app.listen(config.port, () => logger.info(`API Gateway running on port ${config.port}`));
