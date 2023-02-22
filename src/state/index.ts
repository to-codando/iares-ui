import {
  TState,
  TStateHandler,
  TStateHandlerRemove,
} from "./types";

export const createState = <T extends Object>(value: T): TState<T> => {
  const state: T = value;
  const handlers = new Set<TStateHandler<T>>();

  const _notifyHandlers = (value: T): void => {
    handlers.forEach((handler) => handler<T>(value));
  };

  const setState = (payload: T): void => {
    const payloadCopy = JSON.parse(JSON.stringify(payload));
    const stateCopy = JSON.parse(JSON.stringify(state));
    const newState = { ...stateCopy, ...payloadCopy };
    Object.assign(state, newState);
    _notifyHandlers(newState);
  };

  const watchState = (handler: TStateHandler<T>): TStateHandlerRemove => {
    handlers.add(handler);
    return () => handlers.delete(handler);
  };

  return { state, setState, watchState };
};
