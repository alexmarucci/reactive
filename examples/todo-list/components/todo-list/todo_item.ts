import { h } from "../../../../src/render/h";

function component(ClassComponent) {
  let singleton = null;

  if (!singleton) singleton = new ClassComponent();

  return (...args) => {
    h(singleton.view(), ...args);
  };
}

class TodoItem {
  private readonly editInput = h("input", { class: "edit" });

  controller() {
    this.editInput;
  }

  view() {
    return h("div");
  }
}

export const todo_item = component(TodoItem);
