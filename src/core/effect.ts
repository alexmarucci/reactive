import { awaitForInternal, context, isAsyncContext } from "./internals/context";
import { Observable } from "./observable";
import { pendingEffects } from "./utils";

export class Effect {
  private readonly dependencies = new Set<Observable>();

  constructor(
    private readonly callback: Function,
    private readonly executeCondition = () => true
  ) {}

  execute() {
    if (!this.executeCondition()) return;
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

export function effect(callback: Function, condition?: () => boolean) {
  const internal = new Effect(callback, condition);

  if (isAsyncContext()) {
    pendingEffects.add(internal);
  } else {
    internal.execute();
  }
}
