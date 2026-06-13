import { buildApp } from "./app";
import { env } from "./config/env";
import { initializeDatabase, AppDataSource } from "./config/database";
import { UserRepository } from "./repositories/user.repository";
import { CorporateRepository } from "./repositories/corporate.repository";
import { PersonRepository } from "./repositories/person.repository";
import { UserService } from "./services/user.service";
import { CorporateService } from "./services/corporate.service";
import { PersonService } from "./services/person.service";
import { UserController } from "./controllers/user.controller";
import { CorporateController } from "./controllers/corporate.controller";
import { PersonController } from "./controllers/person.controller";
import { PasswordPolicyService } from "./services/password-policy.service";
import { TokenService } from "./services/token.service";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
async function bootstrap() {
  await initializeDatabase();

  const userRepo = new UserRepository(AppDataSource);
  const corporateRepo = new CorporateRepository(AppDataSource);
  const personRepo = new PersonRepository(AppDataSource);
  const passwordPolicy = new PasswordPolicyService();
  const tokenService = new TokenService();
  const userService = new UserService(userRepo, passwordPolicy);
  const corporateService = new CorporateService(corporateRepo, userService);
  const personService = new PersonService(personRepo, userService);
  
  // debug auth service dependencies
  const authService = new AuthService(personService, corporateService, userRepo, tokenService, passwordPolicy);
  
  const userController = new UserController(userService);
  const corporateController = new CorporateController(corporateService);
  const personController = new PersonController(personService);
  const authController = new AuthController(authService);

  const app = buildApp({ userController, authController, corporateController, personController });

  app.listen(env.PORT, () => {
    console.log(`Users service listening on port ${env.PORT} - portfolio estimator app`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to bootstrap users service", error);
  process.exit(1);
});
