import { Hono } from "hono";
import { eventRouter } from "./event.routes.ts";

const mainRouter = new Hono();

mainRouter.route("/events", eventRouter);

export { mainRouter };
