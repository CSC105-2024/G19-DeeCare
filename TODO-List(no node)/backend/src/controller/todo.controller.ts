import type { Context } from "hono";
import * as todoModel from "../model/todo.model.ts";

type Todo = {
  id : Int16Array;
  name : string;
  success : boolean;
}
const GetTodo = async (c: Context) => {
  try {
    const alltodo = await todoModel.GetTodo();
		return c.json({
			success: true,
			data: alltodo,
			msg: "all todo!",
		});
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

const AddTodo = async (c: Context) => {
  try {
    const newname = await c.req.param('name');
    const todo = await todoModel.AddTodo(newname);
		if (!todo.name)
			return c.json(
				{
					success: false,
					data: null,
					msg: "pls write you name",
				},
				400
			);
		const newTodo = await todoModel.AddTodo(
			todo.name
		);
		return c.json({
			success: true,
			data: newTodo,
			msg: "Created new User!",
    });
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

const EditTodoName = async (c: Context) => {
  try {
    const newname = await c.req.param('name');
    const idQuery = await c.req.param('id');
    if (!idQuery) {
        return c.json({ error: "Todo not found" }, 404);
    }
    // const input = c.get('todoData') as UpdateTodoInput;
    const Edit = todoModel.EditTodo(parseInt(idQuery),String(newname));
    return c.json(Edit);
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

const CompleteTodo = async (c: Context) => { 
  try {
    const idQuery = await c.req.param('id');
      if (!idQuery) {
        return c.json({ error: "Todo id is required" }, 404);
      }
      const ComTodo = await todoModel.SuccessTodo(Number(idQuery));
       
      return c.json({
        messsage: 'Good jod finish task +100xp',
        data: ComTodo
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
const DeleteTodo = async (c: Context) => {
  try {
      const idQuery = await c.req.param('id');
      if (!idQuery) {
        return c.json({ error: "Todo id is required" }, 404);
      }
      const deletedTodo = await todoModel.DeleteTodo(Number(idQuery));
       
      return c.json({
        messsage: 'Todo deleted successfully',
        deleted: deletedTodo,
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
