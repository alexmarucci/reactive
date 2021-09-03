import { h } from "../../../../src/render/h";
import { todoStore } from "../../store/todos";

const [, { addTodo }] = todoStore();

export const TodoInput = h("input", {
  class: "new-todo",
  onkeydown: ({ key }: KeyboardEvent) => {
    if (key === "Enter" && TodoInput.value) {
      addTodo(TodoInput.value);
      TodoInput.value = "";
    }
  },
  placeholder: "What needs to be done?"
});
