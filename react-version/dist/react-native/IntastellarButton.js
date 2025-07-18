"use strict";
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
var react_native_1 = require("react-native");
var useIntastellarRN_1 = require("./useIntastellarRN");
var IntastellarButton = function (_a) {
    var _b = _a.theme, theme = _b === void 0 ? { theme: 'light', picker: 'button' } : _b, style = _a.style, textStyle = _a.textStyle, config = __rest(_a, ["theme", "style", "textStyle"]);
    var _c = (0, useIntastellarRN_1.useIntastellarRN)(config), users = _c.users, isLoading = _c.isLoading, signin = _c.signin;
    var handlePress = function () {
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
    var isDark = theme.theme === 'dark';
    return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [
            styles.button,
            isDark ? styles.darkButton : styles.lightButton,
            style,
        ], onPress: handlePress, disabled: isLoading, children: isLoading ? ((0, jsx_runtime_1.jsx)(react_native_1.ActivityIndicator, { color: isDark ? '#fff' : '#3c4043' })) : ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.content, children: [users.length === 1 && ((0, jsx_runtime_1.jsx)(react_native_1.Image, { source: { uri: users[0].image }, style: styles.profileImage })), (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: { uri: 'https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.svg' }, style: styles.logo }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [
                        styles.text,
                        isDark ? styles.darkText : styles.lightText,
                        textStyle,
                    ], children: getButtonText() })] })) }));
};
exports.IntastellarButton = IntastellarButton;
var styles = react_native_1.StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 4,
        borderWidth: 1,
        minHeight: 44,
    },
    lightButton: {
        backgroundColor: '#fff',
        borderColor: '#dadce0',
    },
    darkButton: {
        backgroundColor: '#2d2d2d',
        borderColor: '#5f6368',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    profileImage: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    logo: {
        width: 18,
        height: 18,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
    },
    lightText: {
        color: '#3c4043',
    },
    darkText: {
        color: '#fff',
    },
});
