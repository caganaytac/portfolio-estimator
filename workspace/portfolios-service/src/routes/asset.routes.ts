// asset.routes.ts
import { Router } from "express";
import { jwtAuth } from "../middlewares/jwt-auth.middleware";
import { adminOnly } from "../middlewares/admin-only.middleware";
import { AssetController } from "../controllers/asset.controller";

export const buildAssetRouter = (controller: AssetController) =>{
    const router = Router();
    
    // reads — any authenticated user
    router.get("/listAll", jwtAuth, controller.findAll);
    router.get("/:id", jwtAuth, controller.getById);

    // writes — authenticated AND admin
    router.post("/add", jwtAuth, adminOnly, controller.create);
    router.patch("/update/:id", jwtAuth, adminOnly, controller.update);
    router.delete("/delete/:id", jwtAuth, adminOnly, controller.delete);

    return router;
}