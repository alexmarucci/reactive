import { h, render } from "./h";

describe("the hyperscript function", () => {
  it("creates an empty element", () => {
    expect(h("div").outerHTML).toBe("<div></div>");
  });

  it("creates an element with the given attributes", () => {
    expect(h("div", { class: "classname" }).outerHTML).toBe(
      '<div class="classname"></div>'
    );
  });

  it("creates an element with children", () => {
    expect(h("div", [h("h1", "Child")]).outerHTML).toBe(
      "<div><h1>Child</h1></div>"
    );
  });

  it("creates an element with attributes and children", () => {
    expect(h("div", { class: "name" }, [h("h1", "Child")]).outerHTML).toBe(
      '<div class="name"><h1>Child</h1></div>'
    );
  });

  it("creates an element with text content", () => {
    expect(h("h1", "Hello world").outerHTML).toBe("<h1>Hello world</h1>");
  });

  it("creates an element with computed text content", () => {
    expect(
      h("h1", () => document.createTextNode("Hello world")).outerHTML
    ).toBe("<h1>Hello world</h1>");
  });

  it("creates an element with attributes and text content", () => {
    expect(h("h1", { class: "name" }, "Hello world").outerHTML).toBe(
      '<h1 class="name">Hello world</h1>'
    );
  });

  it("binds an event to an element when the key starts with on*", () => {
    const element = h("h1");
    const eventListenerSpy = jest.spyOn(element, "addEventListener");

    const clickCallback = () => {};
    h(element, { onclick: clickCallback });

    expect(eventListenerSpy).toHaveBeenCalledWith("click", clickCallback);
  });

  it("calls an event when bound to an element", () => {
    const clickHandler = jest.fn();
    const element = h("a", { click: clickHandler });

    element.click();

    expect(clickHandler).toHaveBeenCalled();
  });

  it("executes a function if passed as attribute value", () => {
    const a = document.createElement("a");
    const fakeCallable = jest.fn();
    h(a, { attribute: fakeCallable });

    expect(fakeCallable).toHaveBeenCalledWith(a, "attribute");
  });

  it("uses a document fragment if no selector is provided", () => {
    expect(h("").toString()).toContain("DocumentFragment");
    expect(h([]).toString()).toContain("DocumentFragment");
  });

  it("creates a child from an expression", () => {
    expect(h("div", [() => [h("h1")]]).innerHTML).toBe("<h1></h1>");
  });

  it("creates children from an expression", () => {
    expect(h("div", [() => [h("h1"), h("h2")]]).innerHTML).toBe(
      "<h1></h1><h2></h2>"
    );
  });
});

describe("The render function", () => {
  const rootElement = document.createElement("div");

  it("renders d DOM element", () => {
    render(h("h1", "Hello"), rootElement);

    expect(rootElement.innerHTML).toBe("<h1>Hello</h1>");
  });
});
