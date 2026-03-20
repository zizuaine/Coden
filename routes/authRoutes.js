import { Router } from "express";
import { authSignInController, authRegisterController } from "../controller/auth.controller.js";
import { userMiddleware } from "../middleware/user.js";

const authRouter = Router();

authRouter.post("/register", authRegisterController);
authRouter.post("/signin", authSignInController);
authRouter.get("/me", userMiddleware, (req, res) => {
    res.json({
        userId: req.userId
    });
});

export default authRouter;