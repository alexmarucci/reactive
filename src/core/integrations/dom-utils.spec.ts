import { h } from "../../render/h";
import {
  bindClass,
  bindText,
  bindToAttibute,
  bindToProperty
} from "../dom-utils";
import { observable } from "../observable";

describe("the bindText literal", () => {
  function expectBindText(staticText, ...dynamic) {
    const element = h("h1", bindText(staticText, ...dynamic));
    return expect(element.textContent);
  }

  it("returns an empty string", () => {
    expectBindText``.toBe("");
  });

  it("interpolates static and dynamic strings", () => {
    expectBindText`Hello ${"World"}`.toBe("Hello World");
  });

  it("interpolates static and dynamic expressions", () => {
    expectBindText`Hello ${() => "world"}`.toBe("Hello world");
  });

  it("updates when bound to an observable", () => {
    const [name, setName] = observable("John");
    const div = h("div", bindText`Hello ${name}`);

    expect(div.textContent).toBe("Hello John");

    setName("Jacob");
    expect(div.textContent).toBe("Hello Jacob");
  });

  it("binds to a custom element replacing its text content", () => {
    const div = document.createElement("div");

    div.textContent = "Content to be replaced";

    expect(h(div, bindText`Bind to Div`).textContent).toBe("Bind to Div");
  });
});

describe("the bindToProperty function", () => {
  it("sets a property of an element", () => {
    const input = h("input", {
      value: bindToProperty(() => "123")
    });

    expect(input.value).toBe("123");
  });

  it("binds a property to an observable", () => {
    const [name, setName] = observable("Foo");
    const input = h("input", {
      value: bindToProperty(name)
    });

    expect(input.value).toBe("Foo");

    setName("Bar");
    expect(input.value).toBe("Bar");
  });
});

describe("the bindToAttribute function", () => {
  const input = document.createElement("input");
  const setAttributeSpy = jest.spyOn(input, "setAttribute");

  it("sets an attribute of an element", () => {
    h(input, { value: bindToAttibute(() => "Foobar") });

    expect(setAttributeSpy).toHaveBeenCalledWith("value", "Foobar");
  });

  it("binds an attribute to an observable", () => {
    const [name, setName] = observable("Foo");
    h(input, { value: bindToAttibute(name) });

    expect(setAttributeSpy).toHaveBeenCalledWith("value", "Foo");

    setName("Bar");
    expect(setAttributeSpy).toHaveBeenCalledWith("value", "Bar");
  });
});

describe("The bindClass function", () => {
  function expectBindClassname(staticText, ...args) {
    const element = h("div", { class: bindClass(staticText, ...args) });

    return expect(element.className);
  }

  it("binds to a classname", () => {
    expectBindClassname`classname`.toBe("classname");
  });

  it("binds multiple classnames", () => {
    expectBindClassname`multiple classnames`.toBe("multiple classnames");
  });

  it("binds a static expression", () => {
    expectBindClassname`${"multi classname"}`.toBe("multi classname");
  });

  it("binds a dynamic expression", () => {
    expectBindClassname`${() => "classname"}`.toBe("classname");
  });

  it("updates when bound to an observable", () => {
    const element = document.createElement("div");
    const [isActive, setIsActive] = observable(false);

    bindClass`${() => (isActive() ? "active" : "")}`(element);

    expect(element.className).toBe("");

    setIsActive(true);
    expect(element.className).toBe("active");
  });

  it("filters falsy values", () => {
    expectBindClassname`${false && "class"} ${undefined}`.toBe("");
  });

  it("filters falsy expressions", () => {
    expectBindClassname`${() => null && "class"}`.toBe("");
  });

  it("filters whitespaces", () => {
    expectBindClassname`  hello   `.toBe("hello");
  });
});
