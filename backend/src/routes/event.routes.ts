import { Hono } from "hono";
import * as eventController from "../controllers/event.controller.ts";

const eventRouter = new Hono();

eventRouter.post("/create", eventController.createEvent);
eventRouter.get("/getOne/:id", eventController.read1Event);
eventRouter.get("/getAll", eventController.readAllEvent);
eventRouter.patch("/update/:id", eventController.updateEvent);
eventRouter.delete("/delete/:id", eventController.deleteEvent);

export { eventRouter };