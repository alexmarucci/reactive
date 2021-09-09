import { observableArray } from "../../../src/core/observable-array";

const todos$ = observableArray([]);

export function todoStore() {
  const getters = { todos: () => todos$.read(), todos$ };
  const actions = {
    addTodo: (todo) => todos$.push(todo),
    removeTodo: (todo) => todos$.remove(todo)
  };

  return [getters, actions] as [typeof getters, typeof actions];
}
