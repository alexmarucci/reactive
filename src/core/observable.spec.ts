import { effect, Effect } from "./effect";
import { context } from "./internals/context";
import {
  Observable,
  observable,
  previousValue,
  untrack,
  track,
  whenChanged
} from "./observable";

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

describe("the getPreviousValue function", () => {
  it("returns an observable previous value", () => {
    const [count, setCount] = observable(1);

    setCount(10);

    expect(count()).toBe(10);
    expect(previousValue(count)).toBe(1);
  });
});

describe("the untrack function", () => {
  it("returns the callback", () => {
    expect(untrack(() => "value")).toBe("value");
  });

  it("ignores only changes that are untracked", () => {
    const [count, setCount] = observable(1);
    const [untracked, setUntracked] = observable("untracked");

    const effectSpy = jest.fn(() => count() + untrack(untracked));

    effect(effectSpy);

    setCount(2);
    setUntracked("changed");

    expect(effectSpy).toHaveBeenCalledTimes(2);
  });
});

describe("the track function", () => {
  it("returns the callback", () => {
    expect(track(() => "value")).toBe("value");
  });

  it("tracks its changes", () => {
    const [count, setCount] = observable(1);
    const [untracked, setUntracked] = observable("untracked");

    const effectSpy = jest.fn(() => untrack(() => untracked() + track(count)));

    effect(effectSpy);

    setCount(10);
    setUntracked("changed");

    expect(effectSpy).toBeCalledTimes(2);
  });

  it("ignores same values when initialised as unique", () => {
    const [count, setCount] = observable(1, { uniqueValues: true });
    const effectSpy = jest.fn(() => count());

    effect(effectSpy);

    setCount(1);

    expect(effectSpy).toHaveBeenCalledTimes(1);
  });
});

describe("the whenChanged function", () => {
  it("returns true when all its observables change", () => {
    const [count] = observable(1);
    const [countString] = observable("1");

    expect(whenChanged(count, countString)()).toBe(true);
  });

  it("applies to effects as filter", () => {
    const [count, setCount] = observable(1);
    const effectSpy = jest.fn(() => count());

    effect(effectSpy, whenChanged(count));

    setCount(1);

    expect(effectSpy).toHaveBeenCalledTimes(1);
  });
});
