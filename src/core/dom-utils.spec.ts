import { bindText } from "./dom-utils";
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
