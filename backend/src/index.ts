import {serve} from "@hono/node-server";
import {Hono} from "hono";
import {PrismaClient} from "./generated/prisma/index.js";
import {mainRouter} from "./routes/index.routes.ts";
import {cors} from 'hono/cors';
import dotenv from 'dotenv';

dotenv.config()
const app = new Hono();
export const db = new PrismaClient();

// Apply CORS middleware - FIXED: Added localhost:5174 to allowed origins
app.use('*', cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Added your current frontend port
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
}));

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.route("", mainRouter);

db.$connect()
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });

serve({
    fetch: app.fetch,
    port: 8000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
});