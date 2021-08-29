import { context } from "./internals/context";
import { Observable } from "./observable";

export class Effect {
  private readonly dependencies = new Set<Observable>();

  constructor(private readonly callback: Function) {}

  execute() {
    this.clearDependencies();

    context.push(this);
    this.callback();
    context.pop();
  }

  addDependency(observable: Observable) {
    this.dependencies.add(observable);
  }

  clearDependencies() {
    for (const dependency of [...Array.from(this.dependencies)]) {
      dependency.unsubscribe(this);
      this.dependencies.delete(dependency);
    }
    this.dependencies.clear();
  }
}

export function effect(callback: Function) {
  const internal = new Effect(callback);
  internal.execute();
}
