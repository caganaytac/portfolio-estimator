import { AppError } from "../utils/appError";
import { env } from "../config/env";

const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export class PasswordPolicyService {
  validate(password: string) {
    if (password.length < env.PASSWORD_MIN_LENGTH) {
      throw new AppError(400, `Password must be at least ${env.PASSWORD_MIN_LENGTH} characters`);
    }

    if (!complexityRegex.test(password)) {
      throw new AppError(400, "Password must include upper, lower case letters and digits");
    }
  }
}

