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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIntastellar = useIntastellar;
var react_1 = require("react");
var api_1 = require("./api");
var types_1 = require("./types");
function useIntastellar(config) {
    var _this = this;
    var _a = (0, react_1.useState)([]), users = _a[0], setUsers = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)(false), isSignedIn = _d[0], setIsSignedIn = _d[1];
    var getCookie = function (name) {
        var _a;
        if (typeof document === 'undefined')
            return undefined;
        var value = "; ".concat(document.cookie);
        var parts = value.split("; ".concat(name, "="));
        if (parts.length === 2)
            return (_a = parts.pop()) === null || _a === void 0 ? void 0 : _a.split(';').shift();
    };
    var setCookie = function (name, value, domain, expires) {
        if (typeof document === 'undefined')
            return;
        var cookieString = "".concat(name, "=").concat(value, "; domain=").concat(domain, "; path=/");
        if (expires) {
            cookieString += "; expires=".concat(expires.toUTCString());
        }
        document.cookie = cookieString;
    };
    var getDomain = function () {
        if (typeof window === 'undefined')
            return '';
        var domain = window.location.hostname || window.location.host;
        var domainParts = domain.split('.');
        if (domainParts.length > 2) {
            domainParts.shift();
        }
        if (isNaN(Number(domainParts[0]))) {
            domain = domainParts.join('.');
        }
        return domain.split(':')[0];
    };
    var loadUsers = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var fetchedUsers, hasAppToken, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setIsLoading(true);
                    setError(null);
                    return [4 /*yield*/, api_1.IntastellarAPI.getUsers()];
                case 1:
                    fetchedUsers = _a.sent();
                    setUsers(fetchedUsers);
                    hasAppToken = typeof document !== 'undefined' && !!getCookie('inta_acc');
                    setIsSignedIn(fetchedUsers.length > 0 || hasAppToken);
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'Failed to load users');
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var completeLoginFromStoredToken = (0, react_1.useCallback)(function (token) { return __awaiter(_this, void 0, void 0, function () {
        var account, expires, hasQuery, separator;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_1.IntastellarAPI.verifyToken(token)];
                case 1:
                    account = _a.sent();
                    expires = new Date();
                    expires.setFullYear(expires.getFullYear() + 2);
                    setCookie('inta_acc', token, getDomain(), expires);
                    if (!config.loginCallback) return [3 /*break*/, 3];
                    try {
                        config.loginCallback(account);
                    }
                    catch (e) {
                        console.error('Intastellar loginCallback error:', e);
                    }
                    // Must not reject after callback: signin() would fall through and open OAuth popup.
                    return [4 /*yield*/, loadUsers().catch(function () { })];
                case 2:
                    // Must not reject after callback: signin() would fall through and open OAuth popup.
                    _a.sent();
                    return [2 /*return*/];
                case 3:
                    if (config.loginUri) {
                        hasQuery = window.location.href.includes('?');
                        separator = hasQuery ? '&' : '?';
                        window.location.href = "".concat(window.location.protocol, "//").concat(config.loginUri).concat(separator, "token=").concat(JSON.stringify(account.user));
                        // Page is unloading — do not await loadUsers() (often rejects / races and would reopen popup).
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, loadUsers().catch(function () { })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [config, loadUsers]);
    var signin = (0, react_1.useCallback)(function (email) { return __awaiter(_this, void 0, void 0, function () {
        var appToken, _a, loginUri, loginUrl, loginWindow_1, messageListener_1, checkClosed_1, cleanup, err_2;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    setError(null);
                    if (typeof window === 'undefined') {
                        throw new types_1.IntastellarError('Window object not available');
                    }
                    appToken = getCookie('inta_acc');
                    if (!appToken) return [3 /*break*/, 4];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, completeLoginFromStoredToken(appToken)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 4:
                    loginUri = config.loginUri ||
                        "".concat(location.hostname).concat(location.port ? ':' + location.port : '').concat(location.pathname);
                    loginUrl = api_1.IntastellarAPI.buildLoginUrl({
                        appName: config.appName,
                        clientId: config.clientId,
                        loginUri: loginUri,
                        scopes: config.scopes || 'profile',
                        email: email,
                        type: config.type || 'signin',
                    });
                    loginWindow_1 = window.open(loginUrl, 'intastellarLogin', 'height=719,width=500,left=100,top=100,resizable=no');
                    if (!loginWindow_1) {
                        throw new types_1.IntastellarError('Please enable popups for this website');
                    }
                    messageListener_1 = function (event) { return __awaiter(_this, void 0, void 0, function () {
                        var token, account, expires, hasQuery, separator, err_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    token = event.data;
                                    if (!(token && typeof token === 'string')) return [3 /*break*/, 9];
                                    loginWindow_1.postMessage('iframe-token-received', event.origin);
                                    // Clean up event listener immediately
                                    window.removeEventListener('message', messageListener_1);
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 8, , 9]);
                                    return [4 /*yield*/, api_1.IntastellarAPI.verifyToken(token)];
                                case 2:
                                    account = _a.sent();
                                    expires = new Date();
                                    expires.setFullYear(expires.getFullYear() + 2);
                                    setCookie('inta_acc', token, getDomain(), expires);
                                    if (!config.loginCallback) return [3 /*break*/, 4];
                                    try {
                                        config.loginCallback(account);
                                    }
                                    catch (e) {
                                        console.error('Intastellar loginCallback error:', e);
                                    }
                                    setTimeout(function () {
                                        if (!loginWindow_1.closed) {
                                            loginWindow_1.close();
                                        }
                                    }, 100);
                                    return [4 /*yield*/, loadUsers().catch(function () { })];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 7];
                                case 4:
                                    if (!config.loginUri) return [3 /*break*/, 5];
                                    hasQuery = window.location.href.includes('?');
                                    separator = hasQuery ? '&' : '?';
                                    window.location.href = "".concat(window.location.protocol, "//").concat(config.loginUri).concat(separator, "token=").concat(JSON.stringify(account.user));
                                    setTimeout(function () {
                                        if (!loginWindow_1.closed) {
                                            loginWindow_1.close();
                                        }
                                    }, 100);
                                    return [3 /*break*/, 7];
                                case 5:
                                    loginWindow_1.close();
                                    return [4 /*yield*/, loadUsers().catch(function () { })];
                                case 6:
                                    _a.sent();
                                    _a.label = 7;
                                case 7: return [3 /*break*/, 9];
                                case 8:
                                    err_3 = _a.sent();
                                    setError(err_3 instanceof Error ? err_3.message : 'Authentication failed');
                                    // Close window on error too
                                    if (!loginWindow_1.closed) {
                                        loginWindow_1.close();
                                    }
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); };
                    window.addEventListener('message', messageListener_1);
                    checkClosed_1 = setInterval(function () {
                        if (loginWindow_1.closed) {
                            clearInterval(checkClosed_1);
                            window.removeEventListener('message', messageListener_1);
                        }
                    }, 1000);
                    cleanup = function () {
                        clearInterval(checkClosed_1);
                        window.removeEventListener('message', messageListener_1);
                        if (!loginWindow_1.closed) {
                            loginWindow_1.close();
                        }
                    };
                    // Store cleanup function for potential use
                    window.intastellarCleanup = cleanup;
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _b.sent();
                    setError(err_2 instanceof Error ? err_2.message : 'Sign in failed');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [config, loadUsers, completeLoginFromStoredToken]);
    var logout = (0, react_1.useCallback)(function () {
        var domain = getDomain();
        if (typeof document !== 'undefined') {
            document.cookie = "inta_acc=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.".concat(domain, ";");
        }
        setUsers([]);
        setIsSignedIn(false);
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    }, []);
    (0, react_1.useEffect)(function () {
        loadUsers();
    }, [loadUsers]);
    return {
        users: users,
        isLoading: isLoading,
        error: error,
        signin: signin,
        logout: logout,
        isSignedIn: isSignedIn,
    };
}
//# sourceMappingURL=useIntastellar.js.map