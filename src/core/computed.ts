import { effect } from "./effect";
import { observable } from "./observable";

export function computed<T extends () => unknown>(
  computedFunction: T,
  condition = () => true
) {
  const [getComputedValue, setComputedValue] = observable();

  effect(() => {
    if (condition()) setComputedValue(computedFunction());
  });

  return getComputedValue as T;
}

export function computedx(computedFunction: Function, condition = () => true) {
  const [getComputedValue, setComputedValue] = observable();

  effect(() => {
    if (condition()) setComputedValue(computedFunction());
  });

  return getComputedValue;
}
