export declare type AppSetupParamsType = Object & {
    context?: HTMLElement;
    props?: {
        [key: string]: any;
    };
};
export declare type AppPropsType = AppSetupParamsType & {};
export declare type AppParamsType = {
    onMount: (context: HTMLElement, params?: AppPropsType) => void;
};
export declare type AppType = {
    mount: () => void;
    unmount: () => void;
    setup: (params: AppSetupParamsType) => void;
};
