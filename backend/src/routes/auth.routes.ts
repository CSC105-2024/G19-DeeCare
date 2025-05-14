import {Hono} from "hono";
import * as authController from "../controllers/auth.controller.ts";
import {authMiddleware} from "../middlewares/auth.middlewares.ts";

const authRouter = new Hono();

// Public routes
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

// Protected routes
authRouter.get("/profile", authMiddleware, authController.getProfile);

export {authRouter};