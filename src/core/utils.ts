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

function isObject(object) {
  return object != null && typeof object === "object";
}

export function equal<T>(itemA: T, itemB: T): boolean {
  if (Array.isArray(itemA) && Array.isArray(itemB)) {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return arrayDeepEqual(itemA, itemB);
  } else if (isObject(itemA) && isObject(itemB)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return objDeepEqual(itemA, itemB);
  } else {
    return itemA === itemB;
  }
}

function objDeepEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (object1.constructor !== Object || object2.constructor !== Object) {
    return;
  }

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];

    if (!equal(val1, val2)) return false;
  }

  return true;
}

function arrayDeepEqual<T>(previous: T[], current: T[]): boolean {
  if (previous.length === current.length) {
    return previous.every((value, index) => equal(value, current[index]));
  }
  return false;
}
