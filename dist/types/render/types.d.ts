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
