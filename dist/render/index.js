var _createSelector = function (text) { return text.split(/(?=[A-Z])/).join("-").toLowerCase(); };
var _createId = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};
var _bindProps = function (element, props, isFactory, componentId) {
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
        if (isEvent(attr) === isAction(props[attr]) && isFactory !== true && isEvent(attr) !== true) {
            element.setAttribute(attr, props[attr]);
        }
        if (isCssClass(attr)) {
            var cssClassNames = _applyCssContext(props[attr], componentId);
            element.setAttribute(attr, cssClassNames);
        }
    });
};
var _createChildrenByObject = function (template, context, componentId) {
    if (typeof template !== "object")
        context.textContent += template;
    if (typeof template.type === "function") {
        _createComponent(template, context);
    }
    if (typeof template.type === "string") {
        var element = document.createElement(template.type);
        _bindProps(element, template.props, false, componentId);
        _createChildren(template.children, element, componentId);
        context.insertAdjacentElement("beforeend", element);
    }
};
var _createChildrenByArray = function (template, context, componentId) {
    template.forEach(function (templateItem) {
        _createChildrenByObject(templateItem, context, componentId);
    });
};
var _createChildren = function (template, context, componentId) {
    return !Array.isArray(template)
        ? _createChildrenByObject(template, context, componentId)
        : _createChildrenByArray(template, context, componentId);
};
var _hasStyles = function (selector) { return document.querySelector("style#".concat(selector)); };
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
    stylesElement.insertAdjacentHTML("beforeend", css);
    document.head.insertAdjacentElement("beforeend", stylesElement);
};
var _createComponent = function (template, context) {
    var _a, _b;
    var componentFactory = template.type, props = template.props, children = template.children;
    var component = componentFactory({ props: props });
    var selector = _createSelector(componentFactory.name);
    var hostElement = document.createElement(selector);
    var state = ((_a = component === null || component === void 0 ? void 0 : component.store) === null || _a === void 0 ? void 0 : _a.state) || {};
    var actions = (component === null || component === void 0 ? void 0 : component.actions) || {};
    var componentId = _createId();
    var isFunction = true;
    (_b = component === null || component === void 0 ? void 0 : component.store) === null || _b === void 0 ? void 0 : _b.watchState(function (data) { return _updateView(data); });
    var _updateView = function (payload) {
        var _a;
        hostElement.innerHTML = "";
        (component === null || component === void 0 ? void 0 : component.styles) && _bindCssStyles(component === null || component === void 0 ? void 0 : component.styles(), selector, componentId);
        _bindProps(hostElement, template.props, isFunction, componentId);
        _createChildren(template.children, hostElement, componentId);
        context.insertAdjacentElement("beforeend", hostElement);
        var child = template.type({ props: template.props });
        var childHTM = (_a = child.template) === null || _a === void 0 ? void 0 : _a.call(child, { props: props, state: state, actions: actions });
        _createChildrenByObject(childHTM, hostElement, componentId);
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
    };
    _updateView();
};
export var render = function (template, context) {
    if (context === void 0) { context = document.body; }
    !Array.isArray(template)
        ? _createComponent(template, context)
        : template.forEach(function (templateItem) { return _createComponent(templateItem, context); });
};
//# sourceMappingURL=index.js.map