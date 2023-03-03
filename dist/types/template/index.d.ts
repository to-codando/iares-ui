import { HTMType } from "./types";
declare const css: (tags: any, ...values: any[]) => string;
declare const html: (strings: TemplateStringsArray, ...values: any[]) => HTMType<any, any, any> | HTMType<any, any, any>[];
export { html, css };
