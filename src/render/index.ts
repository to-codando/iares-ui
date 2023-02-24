import { HTMType } from "../template/types";
import {
  GenericObjectType,
  RenderType,
  TemplateType,
  BindStylesParamsType,
} from "./types";

const _createSelector = (text: string) =>
  text.split(/(?=[A-Z])/).join("-").toLowerCase();

const _createId = (): string => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

const _bindProps = (
  element: HTMLElement,
  props: GenericObjectType,
  isFactory = true,
  componentId: string | null,
  selector: string,
) => {
  if (!props) return;

  const attrs = Object.keys(props);
  const isCssClass = (value: string) => /^class/.test(value);
  const isEvent = (value: string) => /^on/.test(value);
  const isAction = (value: string) => typeof value === "function";

  attrs.forEach((attr) => {
    if (isEvent(attr)) {
      const eventName = attr.toLowerCase().replace(/on/, "");
      const handler = props[attr];
      element.addEventListener(eventName, handler);
    }

    if (
      isEvent(attr) === isAction(props[attr]) &&
      isFactory !== true &&
      isEvent(attr) !== true
    ) {
      element.setAttribute(attr, props[attr]);
    }

    if (isCssClass(attr)) {
      const styleElement = document.head.querySelector(`[id=${selector}]`);
      const componentUUID = styleElement?.getAttribute("component-id");
      const cssClassNames = _applyCssContext(
        props[attr],
        componentUUID as string,
      );
      element.setAttribute(attr, cssClassNames);
    }
  });
};

const _createChildrenByObject = (
  template: HTMType,
  context: HTMLElement,
  componentId: string | null,
  selector: string,
) => {
  if (Array.isArray(template)) {
    _createChildrenByArray(template, context, componentId, selector);
  }

  if (typeof template !== "object") context.textContent += template;

  if (typeof template?.type === "function") {
    _createComponent(template, context);
  }

  if (typeof template?.type === "string") {
    const element = document.createElement(template.type);
    _bindProps(element, template.props, false, componentId, selector);
    _createChildren(template.children, element, componentId, selector);
    context.insertAdjacentElement("beforeend", element);
  }
};

const _createChildrenByArray = (
  template: HTMType[],
  context: HTMLElement,
  componentId: string | null,
  selector: string,
) => {
  template.forEach((templateItem) => {
    _createChildrenByObject(templateItem, context, componentId, selector);
  });
};

const _createChildren = (
  template: TemplateType,
  context: HTMLElement,
  componentId: string | null,
  selector: string,
) =>
  !Array.isArray(template)
    ? _createChildrenByObject(template, context, componentId, selector)
    : _createChildrenByArray(template, context, componentId, selector);

const _hasStyles = (selector: string) =>
  document.querySelector(`style#${selector}`);

const _applyCssContext = (cssText: string, id: string | null) => {
  if (!id) return cssText;
  const context = /ctx/g;
  return cssText.replace(context, id);
};

const _bindCssStyles: BindStylesParamsType = (
  styles,
  selector,
  componentId,
) => {
  if (_hasStyles(selector)) return;
  const css = _applyCssContext(styles, componentId);
  const stylesElement = document.createElement("style");
  stylesElement.setAttribute("id", selector);
  stylesElement.setAttribute("component-id", componentId);
  stylesElement.insertAdjacentHTML("beforeend", css);
  document.head.insertAdjacentElement("beforeend", stylesElement);
};

const _createComponent = (template: HTMType, context: HTMLElement) => {
  const { type: componentFactory, props } = template;
  const component = componentFactory({ props });
  const selector = _createSelector(componentFactory.name);
  const hostElement = document.createElement(selector);
  const state = component?.store?.state || {};
  const actions = component?.actions || {};
  const hooks = component?.hooks;
  const componentId = _createId();
  const isFunction = true;
  component?.store?.watchState((data: GenericObjectType) => _updateView(data));
  hooks?.beforeMount?.();

  const _updateView = (payload?: GenericObjectType) => {
    hooks?.beforeRender?.();
    hostElement.innerHTML = "";
    component?.styles &&
      _bindCssStyles(component?.styles(), selector, componentId);

    _bindProps(hostElement, template.props, isFunction, componentId, selector);
    _createChildren(template.children, hostElement, componentId, selector);
    context.insertAdjacentElement("beforeend", hostElement);

    const child = template.type({ props: template.props });
    const childHTM = child.template?.({ props: props || {}, state, actions });
    _createChildrenByObject(childHTM, hostElement, componentId, selector);

    const slotsOrigin = Array.from(context.querySelectorAll("slot[target]"));
    const slotsDestiny = Array.from(context.querySelectorAll("slot[id]"));

    slotsOrigin.forEach((slotOrigin) => {
      const targetId = slotOrigin.getAttribute("target");
      const slotTargetSelector = `slot[id=${targetId}]`;
      const targetSlot = context.querySelector(slotTargetSelector);
      Array.from(slotOrigin.children).forEach((childElement) => {
        targetSlot?.insertAdjacentElement("afterend", childElement);
      });
    });

    slotsOrigin.forEach((slot) => slot.remove());
    slotsDestiny.forEach((slot) => slot.remove());
    hooks?.afterRender?.();
  };

  _updateView();
  hooks?.afterMount?.();
};

export const render: RenderType = (template, context = document.body) => {
  !Array.isArray(template)
    ? _createComponent(template, context)
    : template.forEach((templateItem) =>
        _createComponent(templateItem, context),
      );
};
