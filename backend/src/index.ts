// import { serve } from "@hono/node-server";
// import { Hono } from "hono";
// import { logger } from "hono/logger";
// import { cors } from 'hono/cors';
// import {PrismaClient} from "./generated/prisma/";
// import { mainRouter } from "./routes/index.js";
//
// const app = new Hono();
// export const db = new PrismaClient()
//
// app.use(
//     cors({
//         origin: ["http://localhost:5173"], // Your frontend application
//     })
// );
// app.use(logger());
//
// app.get("/", (c) => {
//     return c.text("if you see this msg mean it not work");
// });
//
// app.route("", mainRouter);
//
// serve(
//     {
//         fetch: app.fetch,
//         port: 8000,
//     },
//     (info) => {
//         console.log(`Server is running on http://localhost:${info.port}`);
//     }
// );
//
// db.$connect()
//     .then(() => {
//         console.log("Connected to the database");
//     })
//     .catch((error: any) => {
//         console.error("Error connecting to the database:", error);
//     });
