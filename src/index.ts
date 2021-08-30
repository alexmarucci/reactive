import { action } from "./core/action";
import { computed } from "./core/computed";
import { effect } from "./core/effect";
import { Observable, observable } from "./core/observable";
import { waitFor } from "./core/utils";

function controller(name, controllerFn) {
  const ctrlEl = document.querySelector(`controller[name="${name}"]`);

  // TODO: throw error or warn
  if (!ctrlEl) return;

  const modelList = Array.from(ctrlEl.querySelectorAll("model"));
  const observableList = {};

  for (const model of modelList) {
    const name = model.getAttribute("name");
    const [g, s] = observable(model.textContent);

    const textNode = document.createTextNode("");
    model.append(textNode);
    effect(() => (textNode.data = g()));

    observableList[name] = [g, s, model];
  }

  controllerFn(ctrlEl, observableList);
}

// const input = document.createElement("input");
// input.placeholder = "Enter name";
// const display = document.createElement("div");
// display.textContent = "Name: ";

// document.body.append(input);
// document.body.append(display);

controller("countCtrl", (element, { name }) => {
  const [input] = element.querySelectorAll(["input"]);
  const [, setName] = name;

  input.oninput = () => setName(input.value);
});

const wo = (() => {
  const [count, setCount] = observable(1);

  return {
    count,
    sum(value: number) {
      action(() => setCount(count() * value));
    }
  };
})();

effect(() => console.log(wo.count()));
wo.sum(10);

waitFor(() => {
  const [value] = observable(async () => "hello");
  effect(() => (document.body.textContent = value()));
});
