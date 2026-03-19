import { Router } from "express";
import { authSignInController, authRegisterController } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", authRegisterController);
authRouter.post("/signin", authSignInController);

export default authRouter;