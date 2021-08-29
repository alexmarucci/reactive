import { action } from "./action";
import { effect } from "./effect";
import { observable } from "./observable";

describe("the action function", () => {
  it("updates multiple deps in one transaction", () => {
    const [count, setCount] = observable(0);
    const [countString, setCountString] = observable("0");

    const effectSpy = jest.fn(() => count() + countString());
    effect(effectSpy);

    action(() => {
      setCount(1);
      setCountString(`1`);
    });

    expect(effectSpy).toBeCalledTimes(2);
  });

  it("retuns a unique set function for multiple observables", () => {
    const [firstName, setFirstName] = observable("John");
    const [lastName, setLastName] = observable("Doe");

    const setFullName = (name: string, surname: string) =>
      action(() => {
        setFirstName(name);
        setLastName(surname);
      });

    setFullName("Foo", "Bar");

    expect(firstName()).toBe("Foo");
    expect(lastName()).toBe("Bar");
  });
});
