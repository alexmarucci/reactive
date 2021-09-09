import { effect } from "../../src/core/effect";
import { computed } from "./computed";
import { observable, previousValue, untrack } from "./observable";
import { ObservableArray, observableArray } from "./observable-array";
import { equal } from "./utils";

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
  const previousExpressionMap = new Map<unknown, string>([]);

  return (element: HTMLElement) => {
    // add static classes
    for (const part of staticText) {
      const trimPart = part.trim();
      if (trimPart) element.className += trimPart;
    }

    for (const dynamicPart of dynamic) {
      if (!dynamicPart) continue;

      effect(() => {
        const previousValue = previousExpressionMap.get(dynamic);
        const computedText = resolve(dynamicPart);
        previousExpressionMap.set(dynamic, computedText);

        if (computedText) {
          element.className += computedText;
        } else if (previousValue && element.classList.contains(previousValue)) {
          element.classList.remove(previousValue);
        }
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

function isFalsy(value: unknown): boolean {
  const emptyArray = Array.isArray(value) && !value.length;
  return !value || emptyArray;
}

function asArray<T>(value: T | T[]): T[] {
  return ([] as T[]).concat(value);
}

export function wrapElementToFragment(
  elementList: HTMLElement[]
): DocumentFragment {
  const fragment = document.createDocumentFragment();

  for (const element of elementList) {
    fragment.appendChild(element);
  }

  return fragment;
}

export function children(expression: () => HTMLElement | HTMLElement[]) {
  const expressionMarker = document.createComment("");

  return (element: HTMLElement) => {
    const children = computed(() => asArray(expression() || []));

    element.appendChild(expressionMarker);

    effect(() => {
      const previousChildren = previousValue(children);
      // // Clear previous fragments
      if (!isFalsy(previousChildren)) {
        previousChildren[0].before(expressionMarker);

        wrapElementToFragment(previousChildren);
      }

      if (!isFalsy(children())) {
        const fragment = wrapElementToFragment(children());
        element.replaceChild(fragment, expressionMarker);
      }
    });
  };
}

export function mapArray<T, U>(
  itemList: () => T[],
  sideEffect: (item: T) => U,
  equalityComparator = equal
): () => U[] {
  function getAdded<T>(previous: T[], current: T[]): T[] {
    return current.filter(
      (cItem) => !previous.some((pItem) => equalityComparator(pItem, cItem))
    );
  }

  const reRunWhenDifferent = () =>
    !previousValue(itemList) ||
    !equalityComparator(previousValue(itemList), itemList());

  const previousMap = new Map([]);

  const mapped = computed(() => {
    const currentList = itemList();
    const previousList = previousValue(itemList) || [];

    const added = getAdded(previousList, currentList);
    const removed = getAdded(currentList, previousList);

    untrack(() =>
      removed.map((item) => {
        previousMap.delete(item);
        return sideEffect(item);
      })
    );

    return itemList().map((item) => {
      if (added.some((itemToMap) => equalityComparator(itemToMap, item))) {
        return untrack(() => {
          const mapValue = sideEffect(item);
          previousMap.set(item, mapValue);
          return mapValue;
        });
      } else {
        return previousMap.get(item);
      }
    });
  }, reRunWhenDifferent);

  return mapped;
}

export function forEach<T, K>(
  list$: ObservableArray<T>,
  mapFunction: (item: T) => K,
  { changeDetection } = { changeDetection: false }
) {
  const itemElementMap = new Map<T, K | Comment>([]);

  function getItemElement(item: T): HTMLElement | Comment | Text {
    if (!itemElementMap.has(item)) {
      itemElementMap.set(item, mapFunction(item) || document.createComment(""));
    }

    return (itemElementMap.get(item) as unknown) as HTMLElement;
  }

  return (element: HTMLElement) => {
    for (const item of list$.read()) {
      element.appendChild(getItemElement(item));
    }

    list$.subscribe(
      (item: T) => {
        element.appendChild(getItemElement(item));
      },
      (item: T, oldItem: T) => {
        if (!changeDetection) return;

        itemElementMap.set(item, itemElementMap.get(oldItem) as Comment);
        element.replaceChild(getItemElement(item), getItemElement(oldItem));
        itemElementMap.delete(oldItem);
      },
      (item: T) => {
        element.removeChild(getItemElement(item));
        itemElementMap.delete(item);
      }
    );
  };
}
