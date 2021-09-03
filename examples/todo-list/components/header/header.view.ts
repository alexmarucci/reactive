// import {} from '../../../ex';

import { h } from "../../../../src/render/h";
import { observable, previousValue } from "../../../../src/core/observable";
import { bindText, children } from "../../../../src/core/dom-utils";

import { computed } from "../../../../src/core/computed";
import { effect } from "../../../../src/core/effect";

const header = h("header", { class: "header" });

// model

// TODO: Support text node only
// TODO: Support node addintion/removal
// TODO: Support functional component

export const HeaderElement = () => {
  const [todos, setTodos] = observable([1]);

  const [loop, setLoop] = observable(false);
  const hasTodos = () => !todos().length;
  const toggleChild = () => setLoop(!loop());

  return h(header, [
    h("button", { onclick: toggleChild }, "TOGGLE CHILD 3"),
    h("h2", "CHILD 1"),
    h("h2", "CHILD 2"),

    children(() => !loop() && [h("h2", "CHILD 3")]),

    h("h2", "CHILD 4")

    // h("h1", "TODOS"),
    // TodoInput,
    // children(() => todos().length && [Main, Footer]),
    // h("h1"),
    // h("h2")
  ]);
};
