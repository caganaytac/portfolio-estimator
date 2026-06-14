import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { UserController } from "./controllers/user.controller";
import { AuthController } from "./controllers/auth.controller";
import { CorporateController } from "./controllers/corporate.controller";
import { PersonController } from "./controllers/person.controller";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/not-found.middleware";
import { requestContext } from "./middlewares/request-context.middleware";
import { buildCorporateRouter } from "./routes/corporate.routes";
import { buildPersonRouter } from "./routes/person.routes";
import { buildUserRouter } from "./routes/user.routes";
import { buildAuthRouter } from "./routes/auth.routes";

export interface AppDependencies {
  userController: UserController;
  authController: AuthController;
  corporateController: CorporateController;
  personController: PersonController;
}

export function buildApp({ userController, authController, corporateController, personController }: AppDependencies) {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "1mb" }));
  app.use(compression());
  app.use(cors());
  app.use(helmet());
  app.use(requestContext);

  app.use("/users", buildUserRouter(userController));
  app.use("/auth", buildAuthRouter(authController));
  app.use("/corporates", buildCorporateRouter(corporateController));
  app.use("/persons", buildPersonRouter(personController));

  app.use("*", notFoundHandler);
  app.use(errorHandler);

  return app;
}
