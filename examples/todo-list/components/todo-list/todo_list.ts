import {
  bindClass,
  bindText,
  bindToProperty,
  forEach
} from "../../../../src/core/dom-utils";
import { observable } from "../../../../src/core/observable";
import { h, div, button, input, ul } from "../../../../src/render/dom";
import { todoStore } from "../../store/todos";

const [{ todos$ }, { changeText, toggleActive, removeTodo }] = todoStore();

const [editedElement, setEditedElement] = observable<HTMLLabelElement>();
const isEditing = (label) => label === editedElement();
const unsetIsEditing = () => setEditedElement(null);

window.addEventListener("click", (e) => {
  if (e.target !== editedElement()) unsetIsEditing();
});

const TodoItem = (todo) => {
  const todo$ = todos$.observe(todo) as {
    text: () => string;
    completed: () => boolean;
  };

  const todo_label = h("label");
  const todo_input = input({ class: "edit" });

  const setEditView = () => {
    setEditedElement(todo_label.node);
    todo_input.focus();
    todo_input.value = todo$.text();
  };

  const checkbox = h("input", { class: "toggle", type: "checkbox" });
  const li = h("li", {
    class: bindClass`${() => isEditing(todo_label.node) && "editing"}`
  });

  return li([
    div({ class: "view" }, [
      checkbox({
        onchange: () => toggleActive(todo),
        checked: bindToProperty(todo$.completed)
      }),
      todo_label({ ondblclick: setEditView }, bindText`${todo$.text}`),
      button({ class: "destroy", onclick: () => removeTodo(todo) })
    ]),
    h(todo_input, { onchange: () => changeText(todo, todo_input.value) })
  ]);
};

export const TodoList = ul({ class: "todo-list" }, [
  forEach(todos$, (todo) => TodoItem(todo))
]);
