"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntastellarButton = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var useIntastellar_1 = require("./useIntastellar");
var IntastellarButton = function (_a) {
    var _b = _a.theme, theme = _b === void 0 ? { theme: 'light', picker: 'button' } : _b, _c = _a.className, className = _c === void 0 ? '' : _c, children = _a.children, style = _a.style, config = __rest(_a, ["theme", "className", "children", "style"]);
    var _d = (0, useIntastellar_1.useIntastellar)(config), users = _d.users, isLoading = _d.isLoading, signin = _d.signin, isSignedIn = _d.isSignedIn;
    var handleClick = function () {
        if (users.length === 1) {
            signin(users[0].email);
        }
        else {
            signin();
        }
    };
    var getButtonText = function () {
        if (isLoading)
            return 'Loading...';
        if (users.length === 1)
            return "Continue as ".concat(users[0].name.first);
        return 'Sign in with Intastellar';
    };
    var buttonClasses = "\n    intastellar-signin-button\n    ".concat(theme.theme === 'dark' ? 'dark' : 'light', "\n    ").concat(className, "\n  ").trim();
    var defaultStyle = __assign({ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', border: '1px solid #dadce0', borderRadius: '4px', backgroundColor: theme.theme === 'dark' ? '#2d2d2d' : '#fff', color: theme.theme === 'dark' ? '#fff' : '#3c4043', fontSize: '14px', fontWeight: '500', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease' }, style);
    return ((0, jsx_runtime_1.jsx)("button", { className: buttonClasses, onClick: handleClick, disabled: isLoading, style: defaultStyle, children: users.length === 1 ?
            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("img", { src: users[0].image, alt: "Profile", style: {
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                        } }), children || getButtonText(), (0, jsx_runtime_1.jsx)("img", { src: "https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.svg", alt: "Intastellar", style: { width: '50px', height: '27px' } })] }) :
            (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("img", { src: "https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.svg", alt: "Intastellar", style: { width: '50px', height: '27px' } }), children || getButtonText()] }) }));
};
exports.IntastellarButton = IntastellarButton;
//# sourceMappingURL=IntastellarButton.js.map