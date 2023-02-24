var _createSelector = function (text) {
    return text.split(/(?=[A-Z])/).join("-").toLowerCase();
};
var _createId = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};
var _bindProps = function (element, props, isFactory, componentId, selector) {
    if (isFactory === void 0) { isFactory = true; }
    if (!props)
        return;
    var attrs = Object.keys(props);
    var isCssClass = function (value) { return /^class/.test(value); };
    var isEvent = function (value) { return /^on/.test(value); };
    var isAction = function (value) { return typeof value === "function"; };
    attrs.forEach(function (attr) {
        if (isEvent(attr)) {
            var eventName = attr.toLowerCase().replace(/on/, "");
            var handler = props[attr];
            element.addEventListener(eventName, handler);
        }
        if (isEvent(attr) === isAction(props[attr]) &&
            isFactory !== true &&
            isEvent(attr) !== true) {
            element.setAttribute(attr, props[attr]);
        }
        if (isCssClass(attr)) {
            var styleElement = document.head.querySelector("[id=".concat(selector, "]"));
            var componentUUID = styleElement === null || styleElement === void 0 ? void 0 : styleElement.getAttribute("component-id");
            var cssClassNames = _applyCssContext(props[attr], componentUUID);
            element.setAttribute(attr, cssClassNames);
        }
    });
};
var _createChildrenByObject = function (template, context, componentId, selector) {
    if (Array.isArray(template)) {
        _createChildrenByArray(template, context, componentId, selector);
    }
    if (typeof template !== "object")
        context.textContent += template;
    if (typeof (template === null || template === void 0 ? void 0 : template.type) === "function") {
        _createComponent(template, context);
    }
    if (typeof (template === null || template === void 0 ? void 0 : template.type) === "string") {
        var element = document.createElement(template.type);
        _bindProps(element, template.props, false, componentId, selector);
        _createChildren(template.children, element, componentId, selector);
        context.insertAdjacentElement("beforeend", element);
    }
};
var _createChildrenByArray = function (template, context, componentId, selector) {
    template.forEach(function (templateItem) {
        _createChildrenByObject(templateItem, context, componentId, selector);
    });
};
var _createChildren = function (template, context, componentId, selector) {
    return !Array.isArray(template)
        ? _createChildrenByObject(template, context, componentId, selector)
        : _createChildrenByArray(template, context, componentId, selector);
};
var _hasStyles = function (selector) {
    return document.querySelector("style#".concat(selector));
};
var _applyCssContext = function (cssText, id) {
    if (!id)
        return cssText;
    var context = /ctx/g;
    return cssText.replace(context, id);
};
var _bindCssStyles = function (styles, selector, componentId) {
    if (_hasStyles(selector))
        return;
    var css = _applyCssContext(styles, componentId);
    var stylesElement = document.createElement("style");
    stylesElement.setAttribute("id", selector);
    stylesElement.setAttribute("component-id", componentId);
    stylesElement.insertAdjacentHTML("beforeend", css);
    document.head.insertAdjacentElement("beforeend", stylesElement);
};
var _createComponent = function (template, context) {
    var _a, _b, _c, _d;
    var componentFactory = template.type, props = template.props;
    var component = componentFactory({ props: props });
    var selector = _createSelector(componentFactory.name);
    var hostElement = document.createElement(selector);
    var state = ((_a = component === null || component === void 0 ? void 0 : component.store) === null || _a === void 0 ? void 0 : _a.state) || {};
    var actions = (component === null || component === void 0 ? void 0 : component.actions) || {};
    var hooks = component === null || component === void 0 ? void 0 : component.hooks;
    var componentId = _createId();
    var isFunction = true;
    (_b = component === null || component === void 0 ? void 0 : component.store) === null || _b === void 0 ? void 0 : _b.watchState(function (data) { return _updateView(data); });
    (_c = hooks === null || hooks === void 0 ? void 0 : hooks.beforeMount) === null || _c === void 0 ? void 0 : _c.call(hooks);
    var _updateView = function (payload) {
        var _a, _b, _c;
        (_a = hooks === null || hooks === void 0 ? void 0 : hooks.beforeRender) === null || _a === void 0 ? void 0 : _a.call(hooks);
        hostElement.innerHTML = "";
        (component === null || component === void 0 ? void 0 : component.styles) &&
            _bindCssStyles(component === null || component === void 0 ? void 0 : component.styles(), selector, componentId);
        _bindProps(hostElement, template.props, isFunction, componentId, selector);
        _createChildren(template.children, hostElement, componentId, selector);
        context.insertAdjacentElement("beforeend", hostElement);
        var child = template.type({ props: template.props });
        var childHTM = (_b = child.template) === null || _b === void 0 ? void 0 : _b.call(child, { props: props || {}, state: state, actions: actions });
        _createChildrenByObject(childHTM, hostElement, componentId, selector);
        var slotsOrigin = Array.from(context.querySelectorAll("slot[target]"));
        var slotsDestiny = Array.from(context.querySelectorAll("slot[id]"));
        slotsOrigin.forEach(function (slotOrigin) {
            var targetId = slotOrigin.getAttribute("target");
            var slotTargetSelector = "slot[id=".concat(targetId, "]");
            var targetSlot = context.querySelector(slotTargetSelector);
            Array.from(slotOrigin.children).forEach(function (childElement) {
                targetSlot === null || targetSlot === void 0 ? void 0 : targetSlot.insertAdjacentElement("afterend", childElement);
            });
        });
        slotsOrigin.forEach(function (slot) { return slot.remove(); });
        slotsDestiny.forEach(function (slot) { return slot.remove(); });
        (_c = hooks === null || hooks === void 0 ? void 0 : hooks.afterRender) === null || _c === void 0 ? void 0 : _c.call(hooks);
    };
    _updateView();
    (_d = hooks === null || hooks === void 0 ? void 0 : hooks.afterMount) === null || _d === void 0 ? void 0 : _d.call(hooks);
};
export var render = function (template, context) {
    if (context === void 0) { context = document.body; }
    !Array.isArray(template)
        ? _createComponent(template, context)
        : template.forEach(function (templateItem) {
            return _createComponent(templateItem, context);
        });
};
//# sourceMappingURL=index.js.map