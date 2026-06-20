import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validateBody } from "../middlewares/validation.middleware";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

export const buildUserRouter = (controller: UserController) => {
  const router = Router();

  router.get("/listAll", controller.listUsers);
  router.get("/by-public/:publicId", controller.getUserByPublicId);

  // For simplicity, create/update/delete routes take place via coporate/person routes
  //router.post("/", validateBody(CreateUserDto), controller.createUser);
  //router.patch("/:id", validateBody(UpdateUserDto), controller.updateUser);
  //router.delete("/:id", controller.deleteUser);

  return router;
};

