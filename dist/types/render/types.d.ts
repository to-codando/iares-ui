import { HTMType } from "../template/types";
export declare type GenericObjectType = {
    [key: string]: any;
};
export declare type TemplateType = HTMType | HTMType[];
export declare type RenderType = {
    (template: TemplateType, context?: HTMLElement, options?: GenericObjectType): void;
};
export declare type BindStylesParamsType = {
    (styles: string, selector: string, id: string): void;
};
export declare type CallbackType = {
    (): void;
};
export declare type HookType = {
    (handler: CallbackType): void;
};
export declare type HooksType = {
    beforeRender: HookType;
    afterRender: HookType;
    beforeMount: HookType;
    afterMount: HookType;
    destroy: HookType;
};
export declare type EventDriveFactoryType = {
    (): HooksType;
};
export declare type ScopeType = {
    uuid: string | null;
    componentId: string | null;
};
