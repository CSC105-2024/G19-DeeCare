import {Hono} from "hono";
import {eventRouter} from "./event.routes.ts";
import {appointmentRouter} from "./appointment.routes.ts";
import {authRouter} from "./auth.routes.ts";
import {doctorRouter} from "./doctor.routes.ts";

const mainRouter = new Hono();

mainRouter.route("/events", eventRouter);
mainRouter.route("/auth", authRouter);
mainRouter.route("/appointments", appointmentRouter);
mainRouter.route("/doctors", doctorRouter);

export {mainRouter};