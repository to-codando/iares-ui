export type TEmpty = null | undefined;

export type TGenericObject<T> = {
  [key: string]: T;
};

export type TStateValue<T> = TGenericObject<T>;

export type TStateHandler<A> = <T extends A>(payload: T) => void;

export type TStateHandlerRemove = () => boolean;

export type TState<T> = {
  state: T;
  setState: (payload: T) => void;
  watchState: (handler: TStateHandler<T>) => TStateHandlerRemove;
};
