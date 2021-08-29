import { Effect } from "./effect";
import { context } from "./internals/context";
import { Observable, observable } from "./observable";

describe("the observable function", () => {
  it("creates an observable", () => {
    const [count] = observable(1);

    expect(count()).toBe(1);
  });

  it("updates with a new value", () => {
    const [count, setCount] = observable(1);

    setCount(10);

    expect(count()).toBe(10);
  });

  it("runs its subscriptions after setting a value", () => {
    const [count, setCount] = observable(1);
    const spyFn = jest.fn();

    // push dependency
    context.push(new Effect(spyFn));
    count();
    context.pop();

    setCount(10);
    expect(spyFn.mock.calls.length).toBe(1);
  });
});

describe("the Observable class", () => {
  it("subcribes to a function", () => {
    const spyFn = jest.fn();
    const observable$ = new Observable(1);

    observable$.subscribe(spyFn);

    observable$.setValue(3);
    expect(spyFn.mock.calls.length).toBe(1);
  });

  it("unsubscribes to a subscription", () => {
    const spyFn = jest.fn();
    const observable$ = new Observable(1);

    const unsubscribe = observable$.subscribe(spyFn);
    unsubscribe();

    observable$.setValue(3);
    expect(spyFn.mock.calls.length).toBe(0);
  });
});
