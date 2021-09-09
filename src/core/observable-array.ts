import { observable, Observable } from "./observable";

type Callback<T> = (item: T, oldItem?: T) => void;

function initialiseMap<T extends {}>(list: T[], mapFn) {
  if (typeof list[0] === "object") {
    return new WeakMap<T, number>(list.map(mapFn));
  } else {
    return new Map<T, number>(list.map(mapFn));
  }
}

export class ObservableArray<T extends {}> {
  private readonly array = this.initialValue;
  private readonly internalObservable = new Observable(this.array, false);
  private readonly arrayIndexMap = initialiseMap(
    this.initialValue,
    (item, index) => [item, index]
  );
  private arrayLength = this.initialValue.length;

  private readonly callbacks = {
    addCallback: [] as Array<(item: T) => void>,
    changeCallback: [] as Array<(item: T, oldItem: T) => void>,
    removeCallback: [] as Array<(item: T) => void>
  };

  constructor(private readonly initialValue: T[] = []) {}

  read() {
    return this.internalObservable.getValue();
  }

  push(item: T) {
    this.array.push(item);

    this.callbacks.addCallback.forEach((s) => s(item));

    this.internalObservable.setValue(this.array);

    return ++this.arrayLength;
  }

  pop() {
    const poppedItem = this.array.pop();

    this.callbacks.removeCallback.forEach((s) => s(poppedItem));
    this.internalObservable.setValue(this.array);

    return poppedItem;
  }

  shift() {
    const shiftedItem = this.array.shift();

    this.callbacks.removeCallback.forEach((s) => s(shiftedItem));
    this.internalObservable.setValue(this.array);

    return shiftedItem;
  }

  /** Use patch for object only */
  patch(item: T, partialItem: Partial<T>) {
    this.replace(item, { ...item, ...partialItem });
  }

  replace(item: T, newItem: T) {
    const id = this.arrayIndexMap.get(item);
    this.array.splice(id, 0, newItem);
    this.arrayIndexMap.delete(item);
    this.arrayIndexMap.set(newItem, id);

    this.callbacks.changeCallback.forEach((s) => s(newItem, item));
    this.internalObservable.setValue(this.array);
  }

  remove(item: T) {
    const id = this.arrayIndexMap.get(item);
    this.array.splice(id, 1);
    this.arrayIndexMap.delete(item);
    this.callbacks.removeCallback.forEach((s) => s(item));
    this.internalObservable.setValue(this.array);
  }

  observe<K extends keyof T>(todo: T, props = Object.keys(todo) as Array<K>) {
    const writes = {};
    const reads = {};

    for (const prop of props) {
      const [read, write] = observable(todo[prop]);
      reads[prop as string] = read;
      writes[prop as string] = write;
    }

    this.subscribe(undefined, (newTodo, oldTodo) => {
      if (oldTodo === todo) {
        for (const prop of props) {
          writes[prop as string](newTodo[prop]);
        }
      }
    });

    return reads as Record<K, () => T[K]>;
  }

  subscribe(
    addCallback?: Callback<T>,
    changeCallback?: Callback<T>,
    removeCallback?: Callback<T>
  ) {
    if (addCallback) this.callbacks.addCallback.push(addCallback);
    if (changeCallback) this.callbacks.changeCallback.push(changeCallback);
    if (removeCallback) this.callbacks.removeCallback.push(removeCallback);
  }
}

export function observableArray<T extends {}>(initialValue: T[]) {
  return new ObservableArray(initialValue);
}
