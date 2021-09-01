import { effect } from "../../../../src/core/effect";
import { observable } from "../../../../src/core/observable";
import { displayElement } from "./header.view";

const [name, setName_] = observable("name");

export const setName = setName_;

export function bindTextContent(el: HTMLElement) {
  effect(() => {
    if (el) displayElement.textContent = name();
  });
}
