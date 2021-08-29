import { computed } from "./computed";
import { observable } from "./observable";

describe("the computed function", () => {
  it("Computes its function", () => {
    const [firstName] = observable("John");
    const [lastName] = observable("Doe");

    const fullName = computed(() => `${firstName()} ${lastName()}`);

    expect(fullName()).toBe("John Doe");
  });

  it("Re-evaluates only when its observables change", () => {
    const [firstName] = observable("John");
    const [lastName, setLastName] = observable("Doe");
    const spyComputedFn = jest.fn(() => `${firstName()} ${lastName()}`);

    const fullName = computed(spyComputedFn);

    expect(fullName()).toBe("John Doe");
    expect(fullName()).toBe("John Doe");
    expect(spyComputedFn).toHaveBeenCalledTimes(1);
    setLastName("Foo");
    expect(spyComputedFn).toHaveBeenCalledTimes(2);
    expect(fullName()).toBe("John Foo");
  });
});
