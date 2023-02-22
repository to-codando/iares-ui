export type AppSetupParamsType = Object & {
	context?: HTMLElement;
	props?: { [key: string]: any };
};

export type AppPropsType = AppSetupParamsType & {};

export type AppParamsType = {
	onMount: (context: HTMLElement, params?: AppPropsType) => void;
};

export type AppType = {
	mount: () => void;
	unmount: () => void;
	setup: (params: AppSetupParamsType) => void;
};