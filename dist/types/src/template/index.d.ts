import { HTMType } from "./types";
declare const css: (tags: string[], ...values: any[]) => string;
declare const html: (strings: TemplateStringsArray, ...values: any[]) => HTMType | HTMType[];
export { html, css };
