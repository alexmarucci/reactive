export const context: Function[] = [];

export function getActiveContext() {
  return context[context.length - 1];
}
