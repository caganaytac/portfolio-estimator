import { jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { buildApp } from "../../src/app";
import { AuthController } from "../../src/controllers/auth.controller";

type Handler = (req: Request, res: Response, next: NextFunction) => unknown;

const ok: Handler = (_req, res) => res.status(200).json({});
const noContent: Handler = (_req, res) => res.status(204).send();

export function buildHttpTestHarness() {
  const authService = {
    login: jest.fn<(...args: any[]) => Promise<any>>(),
    refreshToken: jest.fn<(...args: any[]) => Promise<any>>(),
    changePassword: jest.fn<(...args: any[]) => Promise<any>>(),
    register: jest.fn<(...args: any[]) => Promise<any>>()
  };

  const authController = new AuthController(authService as any);

  const userController = {
    listUsers: ok,
    getUserByPublicId: ok
  };

  const personController = {
    createPerson: ok,
    getPerson: ok,
    getPersonByPublicId: ok,
    listPersons: ok,
    listPersonDetails: ok,
    updatePerson: ok,
    deletePerson: noContent
  };

  const corporateController = {
    createCorporate: ok,
    getCorporate: ok,
    getCorporateDetails: ok,
    getCorporateByPublicId: ok,
    listCorporates: ok,
    updateCorporate: ok,
    deleteCorporate: noContent
  };

  const app = buildApp({
    authController,
    userController: userController as any,
    personController: personController as any,
    corporateController: corporateController as any
  });

  return { app, authService };
}
