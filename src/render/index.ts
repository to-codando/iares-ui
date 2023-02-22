import { HTMType } from "../template/types";
import { GenericObjectType, RenderType, TemplateType } from "./types";

const _createSelector = (text: string) => text.split(/(?=[A-Z])/).join("-").toLowerCase();

const _bindProps = (element: HTMLElement, props: GenericObjectType, isFactory = true) => {
  if (!props) return;

  const attrs = Object.keys(props);
  const isEvent = (value: string) => /^on/.test(value);
  const isAction = (value: string) => typeof value === "function";
  attrs.forEach((attr) => {
    if (isEvent(attr)) {
      const eventName = attr.toLowerCase().replace(/on/, "");
      const handler = props[attr];
      element.addEventListener(eventName, handler);
    }

    if (isEvent(attr) === isAction(props[attr]) && isFactory !== true && isEvent(attr) !== true) {
      element.setAttribute(attr, props[attr]);
    }
  });
};

const _createChildrenByObject = (template: HTMType, context: HTMLElement) => {
  if (typeof template !== "object") context.textContent += template;

  if (typeof template.type === "function") {
    _createComponent(template, context);
  }

  if (typeof template.type === "string") {
    const element = document.createElement(template.type);
    _bindProps(element, template.props, false);
    _createChildren(template.children, element);
    context.insertAdjacentElement("beforeend", element);
  }
};

const _createChildrenByArray = (template: HTMType[], context: HTMLElement) => {
  template.forEach((templateItem) => {
    _createChildrenByObject(templateItem, context);
  });
};

const _createChildren = (template: TemplateType, context: HTMLElement) =>
  !Array.isArray(template)
    ? _createChildrenByObject(template, context)
    : _createChildrenByArray(template, context);

const _createComponent = (template: HTMType, context: HTMLElement) => {
  const { type: componentFactory, props, children } = template;
  const component = componentFactory({ props });
  const selector = _createSelector(componentFactory.name);
  const hostElement = document.createElement(selector);
  const state = component?.store?.state || {};
  const actions = component?.actions || {};

  component?.store?.watchState((data: GenericObjectType) => _updateView(data));

  const _updateView = (payload?: GenericObjectType) => {
    hostElement.innerHTML = "";

    _bindProps(hostElement, template.props);
    _createChildren(template.children, hostElement);
    context.insertAdjacentElement("beforeend", hostElement);

    const child = template.type({ props: template.props });
    const childHTM = child.template?.({ props, state, actions });
    _createChildrenByObject(childHTM, hostElement);

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
  };

  _updateView();
};

export const render: RenderType = (template, context = document.body) => {
  !Array.isArray(template)
    ? _createComponent(template, context)
    : template.forEach((templateItem) => _createComponent(templateItem, context));
};
