import { Effect } from "./effect";
import { waitForInternal } from "./internals/context";

interface AsyncContext {
  promiseList: Set<Promise<unknown>>;
  pendingEffects: Set<Effect>;
}

const asyncContext: AsyncContext[] = [];

export function getActiveAsyncContext(): AsyncContext {
  return asyncContext[asyncContext.length - 1] || ({} as AsyncContext);
}

function flushPendingEffects(pendingEffects: Set<Effect>) {
  for (const effect of [...Array.from(pendingEffects)]) {
    effect.execute();
    pendingEffects.delete(effect);
  }
  pendingEffects.clear();
}

function flushPromiseList(promiseList: Set<Promise<unknown>>) {
  for (const promise of [...Array.from(promiseList)]) {
    promiseList.delete(promise);
  }
  promiseList.clear();
}

export function waitFor(callback: Function) {
  asyncContext.push({
    promiseList: new Set(),
    pendingEffects: new Set()
  });

  waitForInternal(callback);

  const { promiseList, pendingEffects } = getActiveAsyncContext();

  if (promiseList) {
    Promise.all(promiseList).then(() => {
      flushPendingEffects(pendingEffects);
      flushPromiseList(promiseList);
    });
  }

  asyncContext.pop();
}
