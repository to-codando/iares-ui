var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var createState = function (value) {
    var state = value;
    var handlers = new Set();
    var _notifyHandlers = function (value) {
        handlers.forEach(function (handler) { return handler(value); });
    };
    var setState = function (payload) {
        var payloadCopy = JSON.parse(JSON.stringify(payload));
        var stateCopy = JSON.parse(JSON.stringify(state));
        var newState = __assign(__assign({}, stateCopy), payloadCopy);
        Object.assign(state, newState);
        _notifyHandlers(newState);
    };
    var watchState = function (handler) {
        handlers.add(handler);
        return function () { return handlers.delete(handler); };
    };
    return { state: state, setState: setState, watchState: watchState };
};
//# sourceMappingURL=index.js.map