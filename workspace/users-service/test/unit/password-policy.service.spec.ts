import { describe, expect, it } from "@jest/globals";
import { env } from "../../src/config/env";
import { PasswordPolicyService } from "../../src/services/password-policy.service";

describe("PasswordPolicyService", () => {
  const service = new PasswordPolicyService();

  it("accepts a password meeting length and complexity requirements", () => {
    expect(() => service.validate("ValidPass123")).not.toThrow();
  });

  it("rejects passwords shorter than the configured minimum", () => {
    expect(() => service.validate("Aa1")).toThrow(
      expect.objectContaining({
        statusCode: 400,
        message: `Password must be at least ${env.PASSWORD_MIN_LENGTH} characters`
      })
    );
  });

  it.each([
    "UPPERCASE123",
    "lowercase123",
    "NoDigitsHere"
  ])("rejects incomplete complexity: %s", (password) => {
    expect(() => service.validate(password)).toThrow(
      expect.objectContaining({ statusCode: 400 })
    );
  });
});
