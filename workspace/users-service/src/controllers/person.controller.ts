import { NextFunction, Request, Response } from "express";
import { PersonService } from "../services/person.service";

export class PersonController {
  constructor(private readonly personService: PersonService) {}

  createPerson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const person = await this.personService.createPerson(req.body);
      res.status(201).json(person);
    } catch (error) {
      next(error);
    }
  };

  getPerson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const person = await this.personService.getById(userId);
      if (!person) {
        return res.status(404).json({ message: "Person profile not found" });
      }
      res.json(person);
    } catch (error) {
      next(error);
    }
  };

  getPersonByPublicId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const publicId = req.params.publicId;
      const details = await this.personService.getPersonDetailsByPublicId(publicId);
      if (!details) return res.status(404).json({ message: "Person profile not found" });
      res.json(details);
    } catch (error) {
      next(error);
    }
  };

  listPersons = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 25;
      res.json(await this.personService.listPersons(page, pageSize));
    } catch (error) {
      next(error);
    }
  };

  listPersonDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 25;
      res.json(await this.personService.listAllPersonDetails(page, pageSize));
    } catch (error) {
      next(error);
    }
  };

  updatePerson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      const updated = await this.personService.updatePerson(userId, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  deletePerson = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      await this.personService.deletePerson(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
