// import {} from '../../../ex';

import { h, render } from "../../../../src/render/h";
import { observable } from "../../../../src/core/observable";
import { bindText, bindToProperty } from "../../../../src/core/dom-utils";

const [name, setName] = observable("");

const view = h("div", { class: "name" }, [
  h("button", { click: () => setName("") }, "Reset"),
  h("input", {
    input: (e: Event) => setName((<HTMLInputElement>e.target).value),
    value: bindToProperty(name)
  }),
  h("h1", bindText`my name is ${name}`)
]);

render(view, document.body);
