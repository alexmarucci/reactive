import { bindClass, forEach } from "../../../../src/core/dom-utils";
import { observable } from "../../../../src/core/observable";
import { h } from "../../../../src/render/h";
import { todoStore } from "../../store/todos";

const [{ todos$ }] = todoStore();

const [editedElement, setEditedElement] = observable<HTMLLabelElement>();
const isEditing = () => !!editedElement();
const unsetIsEditing = () => setEditedElement(null);

window.addEventListener("click", (e) => {
  if (e.target !== editedElement()) unsetIsEditing();
});

const TodoItem = (todo) => {
  const TodoLabel = h("label", todo);

  return h("li", { class: bindClass`${() => isEditing() && "editing"}` }, [
    h("div", { class: "view", ondblclick: () => setEditedElement(TodoLabel) }, [
      h("input", { class: "toggle", type: "checkbox" }),
      TodoLabel,
      h("button", { class: "destroy", onclick: () => todos$.remove(todo) })
    ]),
    h("input", { class: "edit" })
  ]);
};

// const mapped = mapArray(todos, (todo) => {
//   const to = TodoItem(todo);
//   return to;
// });

export const TodoList = h("ul", { class: "todo-list" }, [
  forEach(todos$, (todo) => TodoItem(todo))
]);
