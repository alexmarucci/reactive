import { effect } from "./effect";
import { observable } from "./observable";
import { waitFor } from "./utils";

function delay(value, delayTime = 300) {
  return new Promise((r) => {
    setTimeout(() => r(value), delayTime);
  });
}

function spyEffect(callback: Function) {
  const spyFn = jest.fn(callback);
  effect(spyFn);
  return spyFn;
}

describe("The waitFor function", () => {
  it("skips initial effect execution", (done) =>
    waitFor(() => {
      const [count] = observable(delay(10));

      effect(() => {
        expect(count()).toBe(10);
        done();
      });
    }));

  it("runs only after promises are resolved", () =>
    waitFor(async () => {
      const delayedValue = delay(10);
      const [asyncCount] = observable(delayedValue);
      const effectSpy = jest.fn(() => asyncCount());
      effect(effectSpy);

      await delayedValue;
      expect(effectSpy).toHaveBeenCalledTimes(1);
    }));

  it("waits only for dependent promises", (done) => {
    waitFor(() => {
      const [first] = observable(delay("first value", 3000));

      waitFor(() => {
        const secondValue = delay("second value", 100);

        const [second] = observable(secondValue);

        const spyFn = spyEffect(() => {
          expect(first()).toBe("first value");
          expect(second()).toBe("second value");

          done();
        });
      });
    });
  });
});
