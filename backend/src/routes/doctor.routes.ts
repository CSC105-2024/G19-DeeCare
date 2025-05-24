import {Hono} from "hono";
import {doctorController} from "../controllers/doctor.controller.js";
import {authMiddleware} from "../middlewares/auth.middlewares.js";

const doctorRouter = new Hono();

// Get all doctors
doctorRouter.get("/", doctorController.getAllDoctors);
doctorRouter.get("/search/:name", doctorController.getDocbySearch);

// Get doctor by ID
doctorRouter.get("/:id", doctorController.getDoctorById);

// Get doctor availability
doctorRouter.get("/:id/availability", doctorController.getDoctorAvailability);

doctorRouter.delete("/:id", doctorController.deleteDoc)
doctorRouter.get("/DE/:department", doctorController.getDocbyDepartment);

export {doctorRouter};
