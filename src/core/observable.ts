import { Effect } from "./effect";
import {
  getActiveContext,
  getIsTransactionInProgress,
  pendingEffects
} from "./internals/context";
import { equal, getActiveAsyncContext } from "./utils";

let isTracking = true;

export function track(callback: Function, shouldTrack = true) {
  const previousTrackingState = isTracking;

  isTracking = shouldTrack;
  const callbackReturn = callback();
  isTracking = previousTrackingState;

  return callbackReturn;
}

export function untrack(callback: Function) {
  return track(callback, false);
}

export class Observable<T = unknown> {
  private readonly subscriptions = new Set<Effect>();

  private value!: T;
  private previousValue?: T;

  constructor(initialValue: T, private readonly uniqueValues = true) {
    this.setValue(initialValue);
  }

  setValue(newValue: T) {
    if (this.uniqueValues && equal(this.value, newValue)) {
      return;
    }

    if (newValue instanceof Promise) {
      const { promiseList } = getActiveAsyncContext();
      if (promiseList) promiseList.add(newValue);
      newValue.then((v) => this.setValue(v));
      return;
    }

    this.previousValue = this.value;
    this.value = newValue;

    this.runSubscriptions();
  }

  getPreviousValue() {
    return this.previousValue;
  }

  getValue() {
    const activeContext = getActiveContext();

    if (activeContext && isTracking) {
      this.subscriptions.add(activeContext);
      activeContext.addDependency(this);
    }

    return this.value;
  }

  subscribe(subscription: Function) {
    const effect = new Effect(subscription);
    this.subscriptions.add(effect);

    return () => this.unsubscribe(effect);
  }

  unsubscribe(effect: Effect) {
    this.subscriptions.delete(effect);
  }

  private runSubscriptions() {
    for (const effect of Array.from(this.subscriptions)) {
      if (getIsTransactionInProgress()) {
        pendingEffects.add(effect);
      } else {
        effect.execute();
      }
    }
  }
}

type valueType<T> = T | Promise<T>;

function isFunction(value): value is Function {
  return typeof value === "function";
}

export function observable<T>(
  value?: (() => valueType<T>) | valueType<T>,
  { uniqueValues = undefined } = {}
) {
  const internal = new Observable<T>(
    (isFunction(value) ? value() : value) as T,
    uniqueValues
  );

  const getter = () => internal.getValue();
  getter.internal_ = internal;
  const setter = (value: T) => internal.setValue(value);

  return [getter, setter] as [
    typeof internal.getValue,
    typeof internal.setValue
  ];
}

export function previousValue<T extends () => unknown>(getter: T) {
  const internalObservable = (getter as unknown) as { internal_: Observable };
  return internalObservable.internal_.getPreviousValue() as ReturnType<T>;
}

export function whenChanged(...getterList: Array<() => unknown>) {
  return () => {
    return getterList.every((getter) => previousValue(getter) !== getter());
  };
}
