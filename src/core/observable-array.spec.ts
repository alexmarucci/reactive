import { observableArray } from "./observable-array";

describe("The observableArray function", () => {
  it("stores an array of values", () => {
    const list = observableArray([{ a: 1 }, { b: 2 }]);

    expect(list.read()).toEqual([{ a: 1 }, { b: 2 }]);
  });

  it.only("handles multiple subscriptions", () => {
    const addCallbackSpy1 = jest.fn();
    const addCallbackSpy2 = jest.fn();
    const list = observableArray([{ a: 1 }, { b: 2 }]);

    list.subscribe(addCallbackSpy1);
    list.subscribe(addCallbackSpy2);
    list.push({ b: 3 });

    expect(addCallbackSpy1).toHaveBeenCalledWith({ b: 3 });
    expect(addCallbackSpy2).toHaveBeenCalledWith({ b: 3 });
  });

  it("triggers the addCallback when an element is added", () => {
    const addCallbackSpy = jest.fn();
    const list = observableArray([{ a: 1 }, { b: 2 }]);

    list.subscribe(addCallbackSpy);
    list.push({ b: 3 });

    expect(addCallbackSpy).toHaveBeenCalledWith({ b: 3 });
  });

  it("triggers the changeCallback when an element is changed", () => {
    const changeCallbackSpy = jest.fn();
    const list = observableArray([{ a: 1 }, { b: 2 }]);

    list.subscribe(undefined, changeCallbackSpy);
    list.replace({ a: 1 }, { a: 4 });

    expect(changeCallbackSpy).toHaveBeenCalledWith({ a: 4 }, { a: 1 });
  });

  it("triggers the deleteCallback when an element is deleted", () => {
    const removeCallbackSpy = jest.fn();
    const ref = { b: 2 };
    const list = observableArray([{ a: 1 }, ref]);

    list.subscribe(undefined, undefined, removeCallbackSpy);
    list.remove(ref);

    expect(removeCallbackSpy).toHaveBeenCalledWith({ b: 2 });
    expect(list.read()).toEqual([{ a: 1 }]);
  });
});
