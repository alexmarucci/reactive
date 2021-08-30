import { effect } from "./effect";
import { observable } from "./observable";
import { waitFor } from "./utils";

function delay(value) {
  return new Promise((r) => {
    setTimeout(() => r(value), 200);
  });
}

describe("The awaitFor function", () => {
  it("skips initial effect execution", (done) =>
    waitFor(() => {
      const [count] = observable(delay(10));

      effect(() => {
        expect(count()).toBe(10);
        done();
      });
    }));

  it("runs only after promises are resolved", async () =>
    waitFor(() => {
      const delayedValue = delay(10);
      const [asyncCount] = observable(delayedValue);
      const effectSpy = jest.fn(() => asyncCount());
      effect(effectSpy);

      await delayedValue;
      expect(effectSpy).toHaveBeenCalledTimes(1);
    }));
});
