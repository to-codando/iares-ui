import htm from "htm";

import { HTMType, GenericObjectType } from "./types";

const css = (tags: any, ...values: any[]): string => {
  return tags
    .map((tag: string, index: number) => {
      return `${tag}${values[index] || ""}`;
    })
    .join("");
};

function h(type: any, props: any, ...children: any[]): HTMType {
  return { type, props, children };
}

const html = htm.bind(h);

export { html, css };
