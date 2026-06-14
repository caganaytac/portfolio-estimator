import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AppError } from "../utils/appError";
import { PersonRegisterDTO } from "../dtos/person-register.dto";
import { CorporateRegisterDTO } from "../dtos/corporate-register.dto";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const tokens = await this.authService.login(email, password);
      res.json(tokens);
    } catch (error) {
      next(error);
    }
  }

  registerPerson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as PersonRegisterDTO;
      const tokens = await this.authService.register({ ...dto, type: "person" as const });
      res.status(201).json(tokens);
    } catch (error) {
      next(error);
    }
  };

  registerCorporate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as CorporateRegisterDTO;
      const tokens = await this.authService.register({ ...dto, type: "corporate" as const });
      res.status(201).json(tokens);
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { publicId } = req.body;
      const tokens = await this.authService.refreshToken(publicId);
      res.json(tokens);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const publicId = req.body.publicId; // set by your auth middleware after verifying the access token
        if (!publicId) {
          throw new AppError(401, "Unauthorized");
        }

        const { currentPassword, newPassword } = req.body;

        const tokens = await this.authService.changePassword({ publicId, currentPassword, newPassword });

        res.status(200).json(tokens);
      } catch (error) {
        next(error);
      }
  };
}

