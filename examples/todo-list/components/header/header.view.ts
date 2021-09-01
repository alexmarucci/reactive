// import {} from '../../../ex';

import { h } from "../../../../src/render/h";
import { effect } from "../../../../src/core/effect";
import { observable } from "../../../../src/core/observable";

function resolve(d) {
  return typeof d === "function" ? d() : d;
}

function bindText(staticText, ...dynamic): (t: Text) => Text {
  const computeText = () =>
    staticText
      .map((part, index) => {
        if (dynamic[index]) return part + resolve(dynamic[index]);
        return part;
      })
      .join("");

  return (textNode: Text) => {
    effect(() => (textNode.data = computeText()));

    return textNode;
  };
}

const [name, setName_] = observable("");

export const setName = setName_;

const el = h("div", { class: "name" }, [
  h("input", {
    input: (e) => setName((e.target as HTMLInputElement).value)
  }),
  h("h1", bindText`my name is ${name}`)
]);

document.body.appendChild(el);
