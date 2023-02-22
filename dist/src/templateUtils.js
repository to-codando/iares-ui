import htm from "htm";
var css = function (tags) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    return tags
        .map(function (tag, index) {
        return "".concat(tag).concat(values[index] || "");
    })
        .join("");
};
function h(type, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    return { type: type, props: props, children: children };
}
var html = htm.bind(h);
export { html, css };
//# sourceMappingURL=templateUtils.js.map