import { Effect } from "./effect";
import { waitForInternal } from "./internals/context";

export const promiseList: Set<Promise<unknown>> = new Set();
export const pendingEffects: Set<Effect> = new Set();

function flushPendingEffects() {
  for (const effect of Array.from(pendingEffects)) {
    effect.execute();
  }
  promiseList.clear();
}

export function waitFor(callback: Function) {
  waitForInternal(callback);
  Promise.all(promiseList).then(flushPendingEffects);
}
