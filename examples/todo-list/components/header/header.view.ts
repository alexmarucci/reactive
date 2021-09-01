// import {} from '../../../ex';

import { h } from "../../../../src/render/h";
import { observable } from "../../../../src/core/observable";
import { bindText } from "../../../../src/core/dom-utils";

const [name, setName_] = observable("");

export const setName = setName_;

const el = h("div", { class: "name" }, [
  h("input", {
    input: (e) => setName((e.target as HTMLInputElement).value)
  }),
  h("h1", bindText`my name is ${name}`)
]);

document.body.appendChild(el);
