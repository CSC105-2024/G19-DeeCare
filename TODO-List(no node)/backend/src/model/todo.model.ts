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
  const todo = await db.todo.update({
    where: {
      id: todoId,
    },
    data: {
      name: editTodoName,
    },
  })
};

const SuccessTodo = async (todoId: number) => {
  const todo = await db.todo.update({
    where: {
      id:todoId
    },
    data:{
      success: true,
   },
  })
};

const DeleteTodo = async (todoId: number) => {
  const todo = await db.todo.delete({
    where: {
      id: todoId,
    }
  })
};

export { GetTodo, AddTodo, EditTodo, SuccessTodo, DeleteTodo };
