import { Effect } from "../effect";

export const context: Effect[] = [];

export const pendingEffects: Set<Effect> = new Set();
export function flushPendingEffects() {
  for (const effect of [...Array.from(pendingEffects)]) {
    effect.execute();
    pendingEffects.delete(effect);
  }

  pendingEffects.clear();
}

export function getActiveContext() {
  return context[context.length - 1];
}

let isTransaction = false;

export function getIsTransactionInProgress() {
  return isTransaction;
}

export function setIsTransactionInProgress(isProgress = true) {
  isTransaction = isProgress;
}
