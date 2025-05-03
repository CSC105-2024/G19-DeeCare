import { Hono } from "hono";
import * as todoController from '../controller/todo.controller.ts';


const todoRouter = new Hono();

todoRouter.get("/", todoController.GetTodo);
todoRouter.get("/:id", (c) => c.text("loading this - todo"));
todoRouter.patch("/:id/:name", todoController.EditTodoName );
todoRouter.patch("/:id", todoController.CompleteTodo );
todoRouter.post("/:name", todoController.AddTodo);
todoRouter.delete("/:id", todoController.DeleteTodo);

export { todoRouter };
