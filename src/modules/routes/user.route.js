import { Router } from "express";
import { wrapAsync } from "../helpers/route.helper.js";
import { registerUser,login, logout } from "../controller/user.controller.js";
import { Authentication } from "../middlewares/jwtAuth.middleware.js";
import { User } from "../models/user.model.js";

const UserRouter = Router();

UserRouter.post("/register", wrapAsync(registerUser));
UserRouter.post("/login", wrapAsync(login));
UserRouter.get("/logout",Authentication(User) , wrapAsync(logout));

export { UserRouter };
