import {Hono} from "hono";
import * as authController from "../controllers/auth.controller.js";
import {authMiddleware} from "../middlewares/auth.middlewares.js";

const authRouter = new Hono();

// Public routes
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

// Protected routes that require authentication
authRouter.get("/profile", authMiddleware, authController.getProfile);
authRouter.put("/profile", authMiddleware, authController.updateProfile);
authRouter.put("/password", authMiddleware, authController.updatePassword);
authRouter.put("/emergency-contact", authMiddleware, authController.updateEmergencyContact);
authRouter.delete("/account", authMiddleware, authController.deleteAccount);

export {authRouter};