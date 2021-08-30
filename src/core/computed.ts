import { effect } from "./effect";
import { observable } from "./observable";

export function computed(computedFunction: Function, condition = () => true) {
  const [getComputedValue, setComputedValue] = observable();

  effect(() => {
    if (condition()) setComputedValue(computedFunction());
  });

  return getComputedValue;
}

export function computedx(computedFunction: Function, condition = () => true) {
  const [getComputedValue, setComputedValue] = observable();

  effect(() => {
    if (condition()) setComputedValue(computedFunction());
  });

  return getComputedValue;
}
