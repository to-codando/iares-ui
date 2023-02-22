var _createSelector = function (text) { return text.split(/(?=[A-Z])/).join("-").toLowerCase(); };
var _bindProps = function (element, props, isFactory) {
    if (isFactory === void 0) { isFactory = true; }
    if (!props)
        return;
    var attrs = Object.keys(props);
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
    });
};
var _createChildrenByObject = function (template, context) {
    if (typeof template !== "object")
        context.textContent += template;
    if (typeof template.type === "function") {
        _createComponent(template, context);
    }
    if (typeof template.type === "string") {
        var element = document.createElement(template.type);
        _bindProps(element, template.props, false);
        _createChildren(template.children, element);
        context.insertAdjacentElement("beforeend", element);
    }
};
var _createChildrenByArray = function (template, context) {
    template.forEach(function (templateItem) {
        _createChildrenByObject(templateItem, context);
    });
};
var _createChildren = function (template, context) {
    return !Array.isArray(template)
        ? _createChildrenByObject(template, context)
        : _createChildrenByArray(template, context);
};
var _createComponent = function (template, context) {
    var _a, _b;
    var componentFactory = template.type, props = template.props, children = template.children;
    var component = componentFactory({ props: props });
    var selector = _createSelector(componentFactory.name);
    var hostElement = document.createElement(selector);
    var state = ((_a = component === null || component === void 0 ? void 0 : component.store) === null || _a === void 0 ? void 0 : _a.state) || {};
    var actions = (component === null || component === void 0 ? void 0 : component.actions) || {};
    (_b = component === null || component === void 0 ? void 0 : component.store) === null || _b === void 0 ? void 0 : _b.watchState(function (data) { return _updateView(data); });
    var _updateView = function (payload) {
        var _a;
        hostElement.innerHTML = "";
        _bindProps(hostElement, template.props);
        _createChildren(template.children, hostElement);
        context.insertAdjacentElement("beforeend", hostElement);
        var child = template.type({ props: template.props });
        var childHTM = (_a = child.template) === null || _a === void 0 ? void 0 : _a.call(child, { props: props, state: state, actions: actions });
        _createChildrenByObject(childHTM, hostElement);
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