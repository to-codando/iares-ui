import { HTMType } from "../template/types";
export declare type GenericObjectType = {
    [key: string]: any;
};
export declare type TemplateType = HTMType | HTMType[];
export declare type RenderType = {
    (template: TemplateType, context?: HTMLElement, options?: GenericObjectType): void;
};
