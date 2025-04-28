import type { Context } from "hono";
import * as todoModel from "../model/todo.model.ts";

const GetTodo = (c: Context) => {
  try {
    
    
  } catch (e) {
    return c.json(
      {
        success: false,
        data: null,
        msg: `Internal Server Error : ${e}`,
      },
      500
    );
  }
};

const AddTodo = (c: Context) => {
  try {
    
  } catch (e) {
    return c.json(
      {
        success: false,
        data: null,
        msg: `Internal Server Error : ${e}`,
      },
      500
    );
  }
};

const EditTodoName = (c: Context) => {
  try {
    
  } catch (e) {
    return c.json(
      {
        success: false,
        data: null,
        msg: `Internal Server Error : ${e}`,
      },
      500
    );
  }
};

const CompleteTodo = (c: Context) => { 
  try {
    const idQuery = c.req.query('id');
    if (!idQuery) {
        return c.json({ error: "Todo not found" }, 404);
    }
    // const input = c.get('todoData') as UpdateTodoInput;
    const CompletedTodo = todoModel.SuccessTodo(parseInt(idQuery));
    return c.json(CompletedTodo);
  } catch (e) {

    return c.json(
      {
        success: false,
        data: null,
        msg: `Internal Server Error : ${e}`,
      },
      500
    );
  }
};
const DeleteTodo = (c: Context) => {
  try {
      const idQuery = c.req.query('id');
      if (!idQuery) {
        return c.json({ error: "Todo not found" }, 404);
      }
      const todoId = todoModel.DeleteTodo(Number(idQuery));
      return c.json({
        messsage: 'Todo deleted successfully',
        deleted: DeleteTodo,
      })
  } catch (e) {
    return c.json(
      {
        success: false,
        data: null,
        msg: `Internal Server Error : ${e}`,
      },
      500
    );
  }
};

export { GetTodo, AddTodo, EditTodoName, CompleteTodo, DeleteTodo };
