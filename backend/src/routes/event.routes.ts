import { Hono } from "hono";
import * as eventController from "../controllers/event.controller.ts";

const eventRouter = new Hono();

eventRouter.get("/getOne/:id", eventController.read1Event);
eventRouter.get("/getAll", eventController.readAllEvent);

export { eventRouter };