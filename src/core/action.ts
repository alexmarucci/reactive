import {
  flushPendingEffects,
  setIsTransactionInProgress
} from "./internals/context";

export function action(actionFunction: Function) {
  setIsTransactionInProgress();
  actionFunction();
  setIsTransactionInProgress(false);

  flushPendingEffects();
}
