import { h } from "../../render/h";
import {
  bindClass,
  bindText,
  bindToAttibute,
  bindToProperty,
  children,
  mapArray
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

describe("The children function", () => {
  function expectChildren(expression) {
    return expect(h("div", [children(() => expression)]).innerHTML);
  }

  it("adds an expression marker when there is no children", () => {
    expectChildren(false).toBe("<!---->");
    expectChildren("").toBe("<!---->");
    expectChildren([]).toBe("<!---->");
  });

  it("adds a child to the element", () => {
    expectChildren(h("h1")).toBe("<h1></h1>");
  });

  it("adds the children to the element", () => {
    expectChildren([h("h1")]).toBe("<h1></h1>");
  });

  it("replaces the children with an expression marker", () => {
    const [swap, setSwap] = observable(true);
    const toggleSwap = () => setSwap(!swap());
    const element = h("div", [children(() => swap() && h("h1"))]);

    expect(element.innerHTML).toBe("<h1></h1>");

    toggleSwap();
    expect(element.innerHTML).toBe("<!---->");
  });

  it("adds the new children when the expression changes", () => {
    const [swap, setSwap] = observable(false);
    const toggleSwap = () => setSwap(!swap());
    const element = h("div", [children(() => swap() && [h("h2")])]);

    expect(element.innerHTML).toBe("<!---->");

    toggleSwap();
    expect(element.innerHTML).toBe("<h2></h2>");
  });

  it("toggle between children", () => {
    const [swap, setSwap] = observable(true);
    const toggleSwap = () => setSwap(!swap());
    const element = h("div", [
      children(() => (swap() ? [h("h1"), h("h1")] : [h("h2"), h("h2")]))
    ]);

    expect(element.innerHTML).toBe("<h1></h1><h1></h1>");

    toggleSwap();
    expect(element.innerHTML).toBe("<h2></h2><h2></h2>");

    toggleSwap();
    expect(element.innerHTML).toBe("<h1></h1><h1></h1>");
  });
});

describe("the mapArray function", () => {
  it("maps the items in the list", () => {
    const mapFnSpy = jest.fn((a) => a);
    const [list] = observable(["a", "b", "c"]);
    const mapped = mapArray(list, mapFnSpy);

    expect(mapped()).toEqual(list());
  });

  it("Runs only the map function on the added item", () => {
    const mapFnSpy = jest.fn((a) => a);
    const [list, setList] = observable(["a", "b", "c"]);

    mapArray(list, mapFnSpy);

    setList([...list(), "d"]);

    expect(mapFnSpy).toHaveBeenCalledTimes(4);
  });

  it("Runs only the map function on the added item", () => {
    const mapFnSpy = jest.fn((a) => a);
    const [list, setList] = observable(["a", "b", "c"]);

    mapArray(list, mapFnSpy);

    setList([...list().filter((item) => item !== "c")]);

    expect(mapFnSpy).toHaveBeenCalledTimes(4);
  });

  it("Returns the latest state of the list", () => {
    const mapFnSpy = jest.fn((a) => a);
    const [list, setList] = observable(["a", "b", "c"]);
    const mapped = mapArray(list, mapFnSpy);

    setList([...list(), "d"]);
    expect(mapped()).toEqual(list());
  });

  it("Runs only the map function on the removed item", () => {
    const mapFnSpy = jest.fn((a) => a);
    const [list, setList] = observable(["a", "b", "c"]);
    const mapped = mapArray(list, mapFnSpy);

    setList([...list().filter((item) => item !== "c")]);
    expect(mapped()).toEqual(list());
  });

  it("Runs only the map function on the changed item", () => {
    const mapFnSpy = jest.fn((a) => a);
    const [list, setList] = observable([
      { text: "Foo" },
      { text: "Foo" },
      { text: "Foo" }
    ]);
    const mapped = mapArray(list, mapFnSpy);

    setList([list[0], { text: "Bar" }, list[2]]);

    expect(mapped()).toEqual(list());
  });

  it("Runs only the map function on the added item", () => {
    const mapFnSpy = jest.fn((a) => a);
    const [list, setList] = observable([
      { text: "Foo" },
      { text: "Foo" },
      { text: "Foo" }
    ]);

    mapArray(list, mapFnSpy);

    setList([list()[0], { text: "Bar" }, list()[2]]);

    expect(mapFnSpy).toHaveBeenCalledTimes(4);
  });
});
