import { h } from "./h";

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

  it("binds an event to an element when a function is passed", () => {
    const element = h("h1");
    const eventListenerSpy = jest.spyOn(element, "addEventListener");

    const clickCallback = () => {};
    h(element, { click: clickCallback });

    expect(eventListenerSpy).toHaveBeenCalledWith("click", clickCallback);
  });

  it("calls an event when bound to an element", () => {
    const clickHandler = jest.fn();
    const element = h("a", { click: clickHandler });

    element.click();

    expect(clickHandler).toHaveBeenCalled();
  });
});
