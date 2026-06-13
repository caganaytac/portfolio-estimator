import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validateBody } from "../middlewares/validation.middleware";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

export const buildUserRouter = (controller: UserController) => {
  const router = Router();

  router.get("/listAll", controller.listUsers);
  router.post("/", validateBody(CreateUserDto), controller.createUser);
  router.get("/by-public/:publicId", controller.getUserByPublicId);
  router.get("/:id", controller.getUser);
  router.patch("/:id", validateBody(UpdateUserDto), controller.updateUser);
  router.delete("/:id", controller.deleteUser);

  return router;
};

