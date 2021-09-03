import { observable } from "../../../src/core/observable";

const [todos, setTodos] = observable([]);

export function todoStore() {
  const getters = { todos };
  const actions = {
    addTodo: (todo) => setTodos([...todos(), todo]),
    removeTodo: ({ id }) => setTodos(todos().filter((todo) => todo.id === id))
  };

  return [getters, actions] as [typeof getters, typeof actions];
}
