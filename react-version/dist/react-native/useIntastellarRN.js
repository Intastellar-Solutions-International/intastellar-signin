"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIntastellarRN = useIntastellarRN;
var react_1 = require("react");
var react_native_1 = require("react-native");
var async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
var types_1 = require("../types");
function useIntastellarRN(config) {
    var _this = this;
    var _a = (0, react_1.useState)([]), users = _a[0], setUsers = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)(false), isSignedIn = _d[0], setIsSignedIn = _d[1];
    var verifyToken = function (token) { return __awaiter(_this, void 0, void 0, function () {
        var response, result, _a, phone, birthday;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch('https://apis.intastellaraccounts.com/verify', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer ".concat(token),
                        },
                    })];
                case 1:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _b.sent();
                    if (result.statusCode === 200) {
                        _a = result.account.user[0], phone = _a.phone, birthday = _a.birthday;
                        result.account.user.phone = phone;
                        result.account.user.birthday = birthday;
                        delete result.account.user[0];
                        return [2 /*return*/, {
                                user: result.account.user,
                                token: token,
                            }];
                    }
                    else {
                        throw new types_1.IntastellarError(result.error);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var loadStoredToken = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var token, account, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 6, 7]);
                    return [4 /*yield*/, async_storage_1.default.getItem('intastellar_token')];
                case 1:
                    token = _a.sent();
                    if (!token) return [3 /*break*/, 3];
                    return [4 /*yield*/, verifyToken(token)];
                case 2:
                    account = _a.sent();
                    setUsers([account.user]);
                    setIsSignedIn(true);
                    _a.label = 3;
                case 3: return [3 /*break*/, 7];
                case 4:
                    err_1 = _a.sent();
                    console.error('Error loading stored token:', err_1);
                    return [4 /*yield*/, async_storage_1.default.removeItem('intastellar_token')];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); }, []);
    var signin = (0, react_1.useCallback)(function (email) { return __awaiter(_this, void 0, void 0, function () {
        var loginUri, params, baseUrl, loginUrl, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setError(null);
                    loginUri = config.loginUri || 'your-app://auth';
                    params = new URLSearchParams({
                        service: config.appName,
                        continue: loginUri,
                        entryFlow: btoa(config.scopes || 'profile'),
                        key: config.clientId,
                        passive: 'true',
                        flowName: 'GeneralOAuthFlow',
                        Entry: 'webauthsignin',
                        scope: config.scopes || 'profile',
                    });
                    if (email) {
                        params.append('identifier', email);
                    }
                    baseUrl = email
                        ? 'https://www.intastellaraccounts.com/signin/v2/ws/oauth/pwd'
                        : 'https://www.intastellaraccounts.com/signin/v2/ws/oauth/oauthchooser';
                    loginUrl = "".concat(baseUrl, "?").concat(params.toString());
                    return [4 /*yield*/, react_native_1.Linking.openURL(loginUrl)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    setError(err_2 instanceof Error ? err_2.message : 'Sign in failed');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [config]);
    var handleDeepLink = (0, react_1.useCallback)(function (url) { return __awaiter(_this, void 0, void 0, function () {
        var urlObj, token, account, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    urlObj = new URL(url);
                    token = urlObj.searchParams.get('token');
                    if (!token) return [3 /*break*/, 3];
                    return [4 /*yield*/, verifyToken(token)];
                case 1:
                    account = _a.sent();
                    return [4 /*yield*/, async_storage_1.default.setItem('intastellar_token', token)];
                case 2:
                    _a.sent();
                    setUsers([account.user]);
                    setIsSignedIn(true);
                    if (config.loginCallback) {
                        config.loginCallback(account);
                    }
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_3 = _a.sent();
                    setError(err_3 instanceof Error ? err_3.message : 'Authentication failed');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [config.loginCallback]);
    var logout = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, async_storage_1.default.removeItem('intastellar_token')];
                case 1:
                    _a.sent();
                    setUsers([]);
                    setIsSignedIn(false);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        loadStoredToken();
        // Listen for deep links
        var subscription = react_native_1.Linking.addEventListener('url', function (_a) {
            var url = _a.url;
            handleDeepLink(url);
        });
        return function () { return subscription === null || subscription === void 0 ? void 0 : subscription.remove(); };
    }, [loadStoredToken, handleDeepLink]);
    return {
        users: users,
        isLoading: isLoading,
        error: error,
        signin: signin,
        logout: logout,
        isSignedIn: isSignedIn,
    };
}
