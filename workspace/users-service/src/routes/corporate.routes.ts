import { Router } from "express";
import { CorporateController } from "../controllers/corporate.controller";
import { validateBody } from "../middlewares/validation.middleware";
import { CreateCorporateDto } from "../dtos/create-corporate.dto";
import { UpdateCorporateDto } from "../dtos/update-corporate.dto";

export const buildCorporateRouter = (controller: CorporateController) => {
  const router = Router();

  router.get("/listAll", controller.listCorporates);
  router.post("/", validateBody(CreateCorporateDto), controller.createCorporate);
  router.get("/by-public/:publicId", controller.getCorporateByPublicId);
  router.get("/details/:userId", controller.getCorporateDetails);
  router.get("/:userId", controller.getCorporate);
  router.patch("/:userId", validateBody(UpdateCorporateDto), controller.updateCorporate);
  router.delete("/:userId", controller.deleteCorporate);

  return router;
};
