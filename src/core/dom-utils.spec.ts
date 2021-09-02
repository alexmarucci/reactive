import {
  bindClass,
  bindText,
  bindToAttibute,
  bindToProperty
} from "./dom-utils";
import { observable } from "./observable";

describe("the bindText literal", () => {
  it("returns an empty string", () => {
    const text = document.createTextNode("");

    expect(bindText``(text).data).toBe("");
  });

  it("interpolates static and dynamic strings", () => {
    const text = document.createTextNode("");

    bindText`Hello ${"World"}`(text);

    expect(text.data).toBe("Hello World");
  });

  it("interpolates static and dynamic expressions", () => {
    const text = document.createTextNode("");

    bindText`Hello ${() => "world"}`(text);

    expect(text.data).toBe("Hello world");
  });

  it("updates when bound to an observable", () => {
    const [name, setName] = observable("John");
    const text = document.createTextNode("Hello world");

    bindText`Hello ${name}`(text);

    expect(text.data).toBe("Hello John");

    setName("Jacob");
    expect(text.data).toBe("Hello Jacob");
  });

  it("binds to a custom element", () => {
    const div = document.createElement("div");

    div.textContent = "Content to be replaced";

    bindText`Bind to Div`(div);

    expect(div.textContent).toBe("Bind to Div");
  });
});

describe("the bindToProperty function", () => {
  const fakeInput = { value: "" };

  it("sets a property of an element", () => {
    bindToProperty(() => "123").callable(fakeInput, "value");

    expect(fakeInput.value).toBe("123");
  });

  it("binds a property to an observable", () => {
    const [name, setName] = observable("Foo");
    bindToProperty(name).callable(fakeInput, "value");

    expect(fakeInput.value).toBe("Foo");

    setName("Bar");
    expect(fakeInput.value).toBe("Bar");
  });
});

describe("the bindToAttribute function", () => {
  const input = document.createElement("input");
  const setAttributeSpy = jest.spyOn(input, "setAttribute");

  it("sets an attribute of an element", () => {
    bindToAttibute(() => "Foobar").callable(input, "value");

    expect(setAttributeSpy).toHaveBeenCalledWith("value", "Foobar");
  });

  it("binds an attribute to an observable", () => {
    const [name, setName] = observable("Foo");
    bindToAttibute(name).callable(input, "value");

    expect(setAttributeSpy).toHaveBeenCalledWith("value", "Foo");

    setName("Bar");
    expect(setAttributeSpy).toHaveBeenCalledWith("value", "Bar");
  });
});

describe("The bindClass function", () => {
  function expectBindClassname(staticText, ...args) {
    const element = document.createElement("div");
    bindClass(staticText, ...args).callable(element, "");

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

    bindClass`${() => (isActive() ? "active" : "")}`.callable(element, "");

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
