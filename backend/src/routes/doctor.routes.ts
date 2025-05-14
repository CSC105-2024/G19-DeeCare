import {Hono} from "hono";
import {doctorController} from "../controllers/doctor.controller.js";
import {authMiddleware} from "../middlewares/auth.middlewares.js";

const doctorRouter = new Hono();

// Get all doctors
doctorRouter.get("/", authMiddleware, doctorController.getAllDoctors);

// Get doctor by ID
doctorRouter.get("/:id", authMiddleware, doctorController.getDoctorById);

// Get doctor availability
doctorRouter.get("/:id/availability", authMiddleware, doctorController.getDoctorAvailability);

export {doctorRouter};