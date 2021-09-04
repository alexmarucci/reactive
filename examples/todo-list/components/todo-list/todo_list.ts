import { computed } from "../../../../src/core/computed";
import { bindText, children, mapArray } from "../../../../src/core/dom-utils";
import { observable } from "../../../../src/core/observable";
import { h } from "../../../../src/render/h";
import { todoStore } from "../../store/todos";

const [{ todos }] = todoStore();

let t = 0;
const TodoItem = (todo) => {
  console.log("running", ++t);
  console.log("todo", todo);
  return h("li", { class: "" }, [
    h("div", { class: "view" }, [
      h("input", { class: "toggle", type: "checkbox" }),
      h("label", todo),
      h("button", { class: "destroy" })
    ]),
    h("input", { class: "edit" })
  ]);
};

const mapped = mapArray(todos, (todo) => {
  const to = TodoItem(todo);
  return to;
});
export const TodoList = h("ul", { class: "todo-list" }, [
  children(() => mapped())
]);
