// import {} from '../../../ex';

import { h, render } from "../../../../src/render/h";
import { observable } from "../../../../src/core/observable";
import { bindText, bindToProperty } from "../../../../src/core/dom-utils";

// model
const [name, setName] = observable("");

// view/controller
export const HeaderElement = h("div", { class: "name" }, [
  h("button", { onclick: () => setName("") }, "Reset"),
  h("input", {
    oninput: (e: Event) => setName((<HTMLInputElement>e.target).value),
    // oninput: console.log,
    value: bindToProperty(name)
  }),
  h("h1", bindText`my name is ${name}`)
]);
