export declare type TEmpty = null | undefined;
export declare type TGenericObject<T> = {
    [key: string]: T;
};
export declare type TStateValue<T> = TGenericObject<T>;
export declare type TStateHandler<A> = <T extends A>(payload: T) => void;
export declare type TStateHandlerRemove = () => boolean;
export declare type TState<T> = {
    state: T;
    setState: (payload: T) => void;
    watchState: (handler: TStateHandler<T>) => TStateHandlerRemove;
};
