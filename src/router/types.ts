export type TError = {
	name: string;
	message: string;
};

export type TCallbackError = {
	(): TError;
} | null;
type TMountParams = {
	[key: string]: HTMLElement;
};

type TMount = {
	(params: TMountParams): void;
};
export type TRoute = {
	start?: string;
	regex: RegExp;
	default?: string;
	mount: TMount;
};

type TRouterInitializer = {
	init: () => void;
};

type TRouterParams = {
	context: HTMLElement;
	routes: TRoute[];
};

export type TRouter = {
	(params: TRouterParams): TRouterInitializer;
};

export type TGenericObject = {
	[key: string]: any;
};
type TCallback = {
	(params: TGenericObject): void;
};

type TValidator = {
	(): boolean;
};

export type TExecute = {
	(validator: TValidator, callback: TCallback, error: TCallbackError): void;
};
