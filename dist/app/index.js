export var createApp = function (params) {
    var hostElement = document.body;
    var appConfig = {};
    var mount = function () {
        params.onMount((appConfig === null || appConfig === void 0 ? void 0 : appConfig.context) || hostElement);
    };
    var unmount = function () { };
    var setup = function (params) {
        Object.assign(appConfig, params);
    };
    return { mount: mount, unmount: unmount, setup: setup };
};
//# sourceMappingURL=index.js.map