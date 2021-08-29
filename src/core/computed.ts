import { effect } from "./effect";
import { observable } from "./observable";

export function computed(computedFunction: Function) {
  const [getComputedValue, setComputedValue] = observable();

  effect(() => setComputedValue(computedFunction()));

  return getComputedValue;
}
