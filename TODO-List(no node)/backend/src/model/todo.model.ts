import { db } from "../index.ts";

const GetTodo =  async () => {
  const todo = await db.todo.findMany();
  return todo;
};

const AddTodo = async (newTodoName: string) => {
  const todo = await db.todo.create({
    data: {
      name: newTodoName,
    },
  });
  return todo;
};

const EditTodo = async (todoId: number, editTodoName: string) => {
  //patch
  const todo = await db.todo.update({
    where: {
      id: todoId,
    },
    data: {
      name: editTodoName,
    },
  });
  return todo;
};

const SuccessTodo = async (todoId: number) => {
  const todo = await db.todo.update({
    where: {
      id: todoId
    },
    data:{
      success: true,
    },
  });
  return todo;
};

const DeleteTodo = async (todoId: number) => {
   await db.todo.delete({
    where: {
      id: todoId,
    }
  });
};

export { GetTodo, AddTodo, EditTodo, SuccessTodo, DeleteTodo };
