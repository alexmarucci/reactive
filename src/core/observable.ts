import { getActiveContext } from "./internals/context";

export class Observable<T> {
  private readonly subscriptions = new Set<Function>();

  constructor(private value: T) {}

  setValue(newValue: T) {
    this.value = newValue;

    this.runSubscriptions();
  }

  getValue() {
    const activeContext = getActiveContext();
    if (activeContext) this.subscribe(activeContext);

    return this.value;
  }

  subscribe(subscription: Function) {
    this.subscriptions.add(subscription);

    return () => this.subscriptions.delete(subscription);
  }

  clearSubscriptions() {
    for (const subscriptionFn of Array.from(this.subscriptions)) {
      this.subscriptions.delete(subscriptionFn);
    }
  }

  private runSubscriptions() {
    for (const subscriptionFn of Array.from(this.subscriptions)) {
      subscriptionFn();
    }
  }
}

export function observable<T>(value: T) {
  const internal = new Observable<T>(value);

  return [
    () => internal.getValue(),
    (value: T) => internal.setValue(value)
  ] as [typeof internal.getValue, typeof internal.setValue];
}
