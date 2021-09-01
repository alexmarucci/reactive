import { effect } from "../../src/core/effect";

function resolve(textOrComputed: string | Function) {
  return typeof textOrComputed === "function"
    ? textOrComputed()
    : textOrComputed;
}

function isTextNode(text: Text | HTMLElement): text is Text {
  return text.nodeType === Node.TEXT_NODE;
}

function resolveNodeType(textOrElement: Text | HTMLElement): Text {
  if (isTextNode(textOrElement)) {
    return textOrElement;
  } else {
    const resultTextNode = document.createTextNode("");

    // clean and replace
    textOrElement.textContent = "";
    textOrElement.appendChild(resultTextNode);

    return resultTextNode;
  }
}

export function bindText(
  staticText: TemplateStringsArray,
  ...dynamic: Array<string | Function>
): (t: HTMLElement | Text) => Text {
  const computedText = () =>
    staticText
      .map((part, index) => part + resolve(dynamic[index] || ""))
      .join("");

  return (textOrElement: HTMLElement | Text) => {
    const textNode = resolveNodeType(textOrElement);

    effect(() => (textNode.data = computedText()));

    return textNode;
  };
}
