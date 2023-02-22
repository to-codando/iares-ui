declare type GenericObjectType = {
    [key: string]: any;
};
declare type HTMType = {
    type: string;
    children: [];
    props: GenericObjectType;
};
declare const css: (tags: TemplateStringsArray) => string;
declare const html: (strings: TemplateStringsArray, ...values: any[]) => HTMType | HTMType[];
export { html, css };
