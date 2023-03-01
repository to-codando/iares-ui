import { HTMType } from "./types";
declare const css: (tags: any, ...values: any[]) => string;
declare const html: (strings: TemplateStringsArray, ...values: any[]) => HTMType<void, void, void> | HTMType<void, void, void>[];
export { html, css };
