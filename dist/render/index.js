var _createSelector = function (text) { return text.split(/(?=[A-Z])/).join("-").toLowerCase(); };
var _createId = function () {
    var randomStr = Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return "".concat(randomStr);
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
        if (isEvent(attr) === isAction(props[attr]) && isFactory !== true && isEvent(attr) !== true) {
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
    // console.log(template);
    if (typeof template !== "object")
        return (context.textContent += template);
    if (typeof (template === null || template === void 0 ? void 0 : template.type) === "function") {
        _createComponent(template, context);
        return;
    }
    if (typeof (template === null || template === void 0 ? void 0 : template.type) === "string") {
        var element = document.createElement(template.type);
        _bindProps(element, template.props, false, componentId, selector);
        _createChildren(template.children, element, componentId, selector);
        context.insertAdjacentElement("beforeend", element);
        return;
    }
    if (Array.isArray(template)) {
        _createChildrenByArray(template, context, componentId, selector);
        return;
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
    stylesElement.setAttribute("component-id", componentId);
    stylesElement.insertAdjacentHTML("beforeend", css);
    document.head.insertAdjacentElement("beforeend", stylesElement);
};
var _createEventDrive = function () {
    var beforeRender = function (handler) {
        handler();
    };
    var afterRender = function (handler) {
        handler();
    };
    var beforeMount = function (handler) {
        handler();
    };
    var afterMount = function (handler) {
        handler();
    };
    var destroy = function () { };
    return {
        beforeRender: beforeRender,
        afterRender: afterRender,
        beforeMount: beforeMount,
        afterMount: afterMount,
        destroy: destroy,
    };
};
var _createComponent = function (template, context) {
    var _a, _b;
    var componentFactory = template.type, props = template.props;
    var component = componentFactory({ props: props });
    var selector = _createSelector(componentFactory.name);
    var hostElement = document.createElement(selector);
    var state = ((_a = component === null || component === void 0 ? void 0 : component.store) === null || _a === void 0 ? void 0 : _a.state) || {};
    var actions = (component === null || component === void 0 ? void 0 : component.actions) || {};
    var hooks = component === null || component === void 0 ? void 0 : component.hooks;
    var componentId = _createId();
    var isFunction = true;
    var _eventDrive = _createEventDrive();
    (_b = component === null || component === void 0 ? void 0 : component.store) === null || _b === void 0 ? void 0 : _b.watchState(function (data) { return _updateView(data); });
    _eventDrive.beforeMount(function () {
        var _a;
        (_a = hooks === null || hooks === void 0 ? void 0 : hooks.beforeMount) === null || _a === void 0 ? void 0 : _a.call(hooks);
    });
    var _updateView = function (payload) {
        var _a;
        _eventDrive.beforeMount(function () {
            var _a;
            (_a = hooks === null || hooks === void 0 ? void 0 : hooks.beforeRender) === null || _a === void 0 ? void 0 : _a.call(hooks);
        });
        hostElement.innerHTML = "";
        (component === null || component === void 0 ? void 0 : component.styles) && _bindCssStyles(component === null || component === void 0 ? void 0 : component.styles(), selector, componentId);
        _bindProps(hostElement, template.props, isFunction, componentId, selector);
        _createChildren(template.children, hostElement, componentId, selector);
        context.insertAdjacentElement("beforeend", hostElement);
        var child = template.type({ props: template.props });
        if (child === null || child === void 0 ? void 0 : child.template) {
            var childHTM = (_a = child.template) === null || _a === void 0 ? void 0 : _a.call(child, { props: props || {}, state: state, actions: actions });
            _createChildrenByObject(childHTM, hostElement, componentId, selector);
        }
        if (!(child === null || child === void 0 ? void 0 : child.template) && typeof (template === null || template === void 0 ? void 0 : template.type) === "function") {
            var childHTM = template === null || template === void 0 ? void 0 : template.type({ props: props || {}, state: state, actions: actions });
            _bindProps(hostElement, template.props, isFunction, componentId, selector);
            _createChildrenByObject(childHTM, hostElement, componentId, selector);
            context.insertAdjacentElement("beforeend", hostElement);
        }
        var slotsOrigin = Array.from(context.querySelectorAll("slot[target]"));
        var slotsDestiny = Array.from(context.querySelectorAll("slot[id]"));
        var scope = {
            uuid: null,
            componentId: null,
        };
        slotsOrigin.forEach(function (slotOrigin) {
            var _a, _b;
            var targetId = slotOrigin.getAttribute("target") || "";
            var targetContext = slotOrigin.getAttribute("ctx");
            var contextStyleElement = (_a = document.head) === null || _a === void 0 ? void 0 : _a.querySelector("#".concat(targetContext));
            var componentContextElement = (_b = document.head) === null || _b === void 0 ? void 0 : _b.querySelector("#".concat(selector));
            var slotTargetSelector = "slot[id=".concat(targetId, "]");
            var targetSlot = context.querySelector(slotTargetSelector);
            scope.uuid = (contextStyleElement === null || contextStyleElement === void 0 ? void 0 : contextStyleElement.getAttribute("component-id")) || null;
            scope.componentId = (componentContextElement === null || componentContextElement === void 0 ? void 0 : componentContextElement.getAttribute("component-id")) || null;
            Array.from(slotOrigin.children).forEach(function (childElement) {
                targetContext && childElement.setAttribute("sloted", targetContext);
                targetSlot === null || targetSlot === void 0 ? void 0 : targetSlot.insertAdjacentElement("afterend", childElement);
            });
        });
        slotsOrigin.forEach(function (slot) { return slot.remove(); });
        slotsDestiny.forEach(function (slot) { return slot.remove(); });
        _eventDrive.afterRender(function () {
            var _a;
            (_a = hooks === null || hooks === void 0 ? void 0 : hooks.afterRender) === null || _a === void 0 ? void 0 : _a.call(hooks);
            var slotedElements = Array.from(hostElement.querySelectorAll("[sloted]"));
            var _bindCssContext = function (element) {
                if (!scope.uuid)
                    return;
                if (!scope.componentId)
                    return;
                var regex = new RegExp(scope.componentId);
                var cssClassNames = element.classList.toString();
                element.className = cssClassNames.replace(regex, scope.uuid);
                var children = Array.from(element.querySelectorAll("[class$=\"".concat(scope.componentId, "\"]")));
                children.forEach(function (element) { return _bindCssContext(element); });
            };
            slotedElements.forEach(function (element) { return _bindCssContext(element); });
        });
    };
    _updateView();
    _eventDrive.afterMount(function () {
        var _a;
        (_a = hooks === null || hooks === void 0 ? void 0 : hooks.afterMount) === null || _a === void 0 ? void 0 : _a.call(hooks);
    });
};
export var render = function (template, context) {
    if (context === void 0) { context = document.body; }
    !Array.isArray(template) ? _createComponent(template, context) : template.forEach(function (templateItem) { return _createComponent(templateItem, context); });
};
//# sourceMappingURL=index.js.map