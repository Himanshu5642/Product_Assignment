import { Router } from "express";
import { UserRouter } from "./modules/routes/user.route.js";
import { ProductRouter } from "./modules/routes/Products.route.js";

const router = Router();
const Routes = { UserRouter, ProductRouter };

for (const route of Object.keys(Routes)) {
  router.use(Routes[route]);
}

export { router };
