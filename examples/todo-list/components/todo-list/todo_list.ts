import { computed } from "../../../../src/core/computed";
import { bindText, children } from "../../../../src/core/dom-utils";
import { observable } from "../../../../src/core/observable";
import { h } from "../../../../src/render/h";
import { todoStore } from "../../store/todos";

const [{ todos }] = todoStore();

const t = 0;
const TodoItem = (todo) => {
  return h("li", { class: "editing" }, [
    h("div", { class: "view" }, [
      h("input", { class: "toggle", type: "checkbox" }),
      h("label", todo),
      h("button", { class: "destroy" })
    ]),
    h("input", { class: "edit" })
  ]);
};

export const TodoList = h("ul", { class: "todo-list" }, [
  children(() => todos().map((todo) => TodoItem(todo)))
]);
