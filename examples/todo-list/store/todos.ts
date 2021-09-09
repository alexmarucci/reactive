import { observableArray } from "../../../src/core/observable-array";

const todos$ = observableArray<{ completed: boolean; text: string }>([]);

export function todoStore() {
  const getters = { todos: () => todos$.read(), todos$ };
  const actions = {
    addTodo: (text) => todos$.push({ text, completed: false }),
    changeText: (todo, text) => todos$.patch(todo, { text }),
    toggleActive: (todo) => todos$.patch(todo, { completed: !todo.completed }),
    removeTodo: (todo) => todos$.remove(todo)
  };

  return [getters, actions] as [typeof getters, typeof actions];
}
