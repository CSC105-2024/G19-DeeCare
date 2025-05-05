import { Hono } from "hono";
import { router } from "./routes.ts";

const mainRouter = new Hono();

mainRouter.route("/todo", router);

export { mainRouter };
