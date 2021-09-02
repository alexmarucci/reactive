import { effect } from "../../src/core/effect";
import { AttributeObject } from "../render/h";

function resolve(textOrComputed: unknown | Function) {
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

function computedTextFactory(
  staticText: TemplateStringsArray,
  ...dynamic: Array<string | Function>
) {
  return () =>
    staticText
      .map((part, index) => part + resolve(dynamic[index] || ""))
      .join("");
}

export function bindText(
  staticText: TemplateStringsArray,
  ...dynamic: Array<string | Function>
): (t: HTMLElement | Text) => Text {
  const computedText = computedTextFactory(staticText, ...dynamic);

  return (textOrElement: HTMLElement | Text) => {
    const textNode = resolveNodeType(textOrElement);

    effect(() => (textNode.data = computedText()));

    return textNode;
  };
}

export function bindClass(
  staticText: TemplateStringsArray,
  ...dynamic: Array<(() => string | boolean) | string | boolean>
) {
  return (element: HTMLElement) => {
    // add static classes
    for (const part of staticText) {
      const trimPart = part.trim();
      if (trimPart) element.className += trimPart;
    }

    for (const dynamicPart of dynamic) {
      if (!dynamicPart) continue;

      effect(() => {
        const computedText = resolve(dynamicPart);

        if (computedText) element.className += computedText;
      });
    }
  };
}

export const bind = (
  expression: () => unknown,
  type: "attribute" | "classname" | "property" = "attribute"
) => (element: HTMLElement, attributeName: string) => {
  if (["function", "object"].includes(typeof expression())) {
    throw new Error(
      `Error binding attribute to ${expression.toString()}` +
        `which was expected to be a string`
    );
  }

  if (type === "attribute") {
    // let it fail if not a string
    effect(() => element.setAttribute(attributeName, expression() as string));
  } else if (type === "property") {
    effect(() => (element[attributeName] = expression()));
  } else if (type === "classname") {
    effect(() => element.classList.toggle(attributeName, !!expression()));
  }
};

export const bindToAttibute = (expression: () => unknown) =>
  bind(expression, "attribute");

export const bindToProperty = (expression: () => unknown) =>
  bind(expression, "property");
