import {
  bindClass,
  bindText,
  bindToProperty,
  forEach
} from "../../../../src/core/dom-utils";
import { effect } from "../../../../src/core/effect";
import { observable } from "../../../../src/core/observable";
import { h } from "../../../../src/render/h";
import { todoStore } from "../../store/todos";

const [{ todos$ }] = todoStore();

const [editedElement, setEditedElement] = observable<HTMLLabelElement>();
const isEditing = (label) => label === editedElement();
const unsetIsEditing = () => setEditedElement(null);

window.addEventListener("click", (e) => {
  if (e.target !== editedElement()) unsetIsEditing();
});

const TodoItem = (todo) => {
  const [value, setValue] = observable(todo);
  const TodoLabel = h("label");
  const TodoInput = h("input", { class: "edit" });

  const setEditView = () => {
    setEditedElement(TodoLabel);
    TodoInput.focus();
    setValue(todo);
  };

  return h(
    "li",
    { class: bindClass`${() => isEditing(TodoLabel) && "editing"}` },
    [
      h("div", { class: "view", ondblclick: setEditView }, [
        h("input", { class: "toggle", type: "checkbox" }),
        h(TodoLabel, bindText`${value}`),
        h("button", {
          class: "destroy",
          onclick: () => todos$.remove(todo)
        })
      ]),
      h(TodoInput, {
        oninput: () => setValue(TodoInput.value),
        value: bindToProperty(value)
      })
    ]
  );
};

// const mapped = mapArray(todos, (todo) => {
//   const to = TodoItem(todo);
//   return to;
// });

export const TodoList = h("ul", { class: "todo-list" }, [
  forEach(todos$, (todo) => TodoItem(todo))
]);
