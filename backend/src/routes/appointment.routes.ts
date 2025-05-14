import {Hono} from "hono";
import * as appointmentController from "../controllers/auth.controller.js";
import {authMiddleware} from "../middlewares/auth.middlewares.js";

const appointmentRouter = new Hono();

// Create a new appointment
appointmentRouter.post("/", authMiddleware, appointmentController.createAppointment);

// Get user's appointments
appointmentRouter.get("/user", authMiddleware, appointmentController.getUserAppointments);

// Delete an appointment
appointmentRouter.delete("/:id", authMiddleware, appointmentController.deleteAppointment);

export {appointmentRouter};