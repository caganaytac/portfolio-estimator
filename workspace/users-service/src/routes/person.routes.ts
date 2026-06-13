import { Router } from "express";
import { PersonController } from "../controllers/person.controller";
import { validateBody } from "../middlewares/validation.middleware";
import { CreatePersonDto } from "../dtos/create-person.dto";
import { UpdatePersonDto } from "../dtos/update-person.dto";

export const buildPersonRouter = (controller: PersonController) => {
  const router = Router();

  router.get("/", controller.listPersons);
  router.get("/listAll", controller.listPersonDetails);
  router.post("/", validateBody(CreatePersonDto), controller.createPerson);
  router.get("/by-public/:publicId", controller.getPersonByPublicId);
  router.get("/:userId", controller.getPerson);
  router.patch("/:userId", validateBody(UpdatePersonDto), controller.updatePerson);
  router.delete("/:userId", controller.deletePerson);

  return router;
};
