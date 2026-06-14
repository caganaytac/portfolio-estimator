import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validation.middleware";
import { LoginDto } from "../dtos/login.dto";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { PersonRegisterDTO } from "../dtos/person-register.dto";
import { CorporateRegisterDTO } from "../dtos/corporate-register.dto";

export const buildAuthRouter = (controller: AuthController) => {
  const router = Router();

  router.post("/login", validateBody(LoginDto), controller.login);
  router.post("/refresh", validateBody(RefreshTokenDto), controller.refresh);
  router.post("/change-password", validateBody(ChangePasswordDto), controller.changePassword);
  router.post("/register/person", validateBody(PersonRegisterDTO), controller.registerPerson);
  router.post("/register/corporate", validateBody(CorporateRegisterDTO), controller.registerCorporate);
  return router;
};

