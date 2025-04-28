import { Hono } from "hono";

const todoRouter = new Hono();

todoRouter.get("/", (c) => c.text("Hello From Todo Router"));
todoRouter.get("/:id", (c) => c.text("Hello From Todo Router"));
todoRouter.post("/", (c) => c.text("Hello From Todo Router"));
todoRouter.delete("/:id", (c) => c.text("Hello From Todo Router"));
export { todoRouter };
