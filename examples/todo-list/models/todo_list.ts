import { observable } from "../../../src/core/observable";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export const [todoList, setTodoList] = observable([]);

export function addTodo(todo: Todo) {
  todoList().push(todo);

  setTodoList(todoList());
}

export function removeTodo({ id }) {
  const indexToRemove = todoList().findIndex((todo) => todo.id === id);
  todoList().splice(indexToRemove, 1);
  setTodoList(todoList());
}
