type AttributeCallback = (e: HTMLElement, k: string) => void;
type Attributes = Record<
  string,
  AttributeCallback | string | EventListenerOrEventListenerObject
>;
type Children = Array<HTMLElement | Text>;
type TextContent = ((t: Text) => Text) | string;
type Selector = keyof HTMLElementTagNameMap | string | HTMLElement;
type ElementReturnType<K> = K extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[K]
  : K extends HTMLElement
  ? K
  : HTMLElement;

function assert<T>(value: unknown, type: string): value is T {
  return typeof value === type;
}

function wrapTextContent(
  textOrChildren: Children | TextContent | Function
): Children {
  const textNode = document.createTextNode("");

  if (assert<Function>(textOrChildren, "function")) {
    return [textOrChildren(textNode)];
  } else if (assert<string>(textOrChildren, "string")) {
    textNode.data = textOrChildren;
    return [textNode];
  } else {
    return textOrChildren;
  }
}

function constructElement(selector: Selector, attributes: Attributes = {}) {
  const element = assert<string>(selector, "string")
    ? document.createElement(selector)
    : selector;

  // Clear up the element before construction
  element.textContent = "";

  for (const [key, value] of Object.entries(attributes)) {
    if (
      /^(on)/.test(key) &&
      assert<EventListenerOrEventListenerObject>(value, "function")
    ) {
      element.addEventListener(key.substring(2), value);
    } else if (assert<AttributeCallback>(value, "function")) {
      value(element, key);
    } else {
      element.setAttribute(key, value as string);
    }
  }

  return element;
}

function extractAttributesAndChildren(
  attributesOrChildren: Attributes | Children | TextContent
): [Attributes | undefined, Children | undefined] {
  if (
    Array.isArray(attributesOrChildren) ||
    assert<TextContent>(attributesOrChildren, "string") ||
    assert<TextContent>(attributesOrChildren, "function")
  ) {
    return [undefined, wrapTextContent(attributesOrChildren)];
  } else {
    return [attributesOrChildren, undefined];
  }
}

export function h<K extends Selector>(selector: K): ElementReturnType<K>;
export function h<K extends Selector>(
  selector: K,
  textContent?: TextContent
): ElementReturnType<K>;

export function h<K extends Selector>(
  selector: K,
  children?: Children
): ElementReturnType<K>;
export function h<K extends Selector>(
  selector: K,
  attributes?: Attributes
): ElementReturnType<K>;

export function h<K extends Selector>(
  selector: K,
  attributes: Attributes,
  textContent: TextContent
): ElementReturnType<K>;

export function h<K extends Selector>(
  selector: K,
  attributes: Attributes,
  children: Children
): ElementReturnType<K>;

export function h(
  selector: Selector,
  attributesOrChildren?: Attributes | Children | TextContent,
  optionalChildren?: Children | TextContent
) {
  const [attributes, childrenFromAttributes] = extractAttributesAndChildren(
    attributesOrChildren
  );

  const element = constructElement(selector, attributes);
  const children =
    wrapTextContent(optionalChildren) || childrenFromAttributes || [];

  for (const child of children) element.appendChild(child);

  return element;
}

export function render(template: HTMLElement, root: HTMLElement) {
  root.textContent = "";
  root.appendChild(template);
}
