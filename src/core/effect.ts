import { context, isAsyncContext } from "./internals/context";
import { Observable } from "./observable";
import { getActiveAsyncContext } from "./utils";

export class Effect {
  private readonly dependencies = new Set<Observable>();

  constructor(
    private readonly callback: Function,
    private readonly executeCondition = () => true
  ) {}

  execute() {
    if (!this.executeInContext(this.executeCondition)) return;

    this.clearDependencies();

    this.executeInContext(this.callback);
  }

  private executeInContext(callback: Function) {
    context.push(this);
    const returnStatement = callback();
    context.pop();

    return returnStatement;
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
    const { pendingEffects } = getActiveAsyncContext();
    if (pendingEffects) pendingEffects.add(internal);
  } else {
    internal.execute();
  }
}
