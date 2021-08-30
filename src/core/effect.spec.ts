import { Effect, effect } from "./effect";
import { getActiveContext } from "./internals/context";
import { observable, Observable } from "./observable";

describe("the effect function", () => {
  it("adds itself to the context", () => {
    effect(() => {
      expect(getActiveContext()).toBeInstanceOf(Effect);
    });

    expect(getActiveContext()).toBeUndefined();
  });

  it("Executes when an observable changes value", () => {
    const [count, setCount] = observable(0);
    const spyEffect = jest.fn(() => count());

    effect(spyEffect);

    setCount(2);

    expect(spyEffect).toHaveBeenCalledTimes(2);
  });

  it("does not execute when we do not pass the condition", () => {
    const [count, setCount] = observable(0);
    const spyEffect = jest.fn(() => count());

    effect(spyEffect, () => false);

    setCount(2);

    expect(spyEffect).toHaveBeenCalledTimes(0);
  });
});

describe("the Effect class", () => {
  it("clear all dependencies after execution", () => {
    const effect = new Effect(() => {});
    const clearDependenciesSpy = jest.spyOn(effect, "clearDependencies");

    effect.addDependency(new Observable(1));
    effect.addDependency(new Observable(3));

    effect.execute();

    expect(clearDependenciesSpy).toHaveBeenCalled();
  });

  it("Removes itself from the observable subscriptions before each execution", () => {
    const effect = new Effect(() => {});
    const observable = new Observable(1);
    const unsubscribeSpy = jest.spyOn(observable, "unsubscribe");

    effect.addDependency(observable);
    effect.execute();

    expect(unsubscribeSpy).toHaveBeenCalledWith(effect);
  });
});
