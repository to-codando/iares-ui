import { HTMType } from "../template/types";

export type GenericObjectType = {
  [key: string]: any;
};

export type TemplateType = HTMType | HTMType[];

export type RenderType = {
  (template: TemplateType, context?: HTMLElement, options?: GenericObjectType): void;
};
