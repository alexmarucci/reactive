import { Effect } from "./effect";
import {
  getActiveContext,
  getIsTransactionInProgress,
  pendingEffects
} from "./internals/context";

export class Observable<T = unknown> {
  private readonly subscriptions = new Set<Effect>();

  constructor(private value: T) {}

  setValue(newValue: T) {
    this.value = newValue;

    this.runSubscriptions();
  }

  getValue() {
    const activeContext = getActiveContext();
    if (activeContext) {
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

export function observable<T>(value?: T) {
  const internal = new Observable<T>(value);

  return [
    () => internal.getValue(),
    (value: T) => internal.setValue(value)
  ] as [typeof internal.getValue, typeof internal.setValue];
}
