"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntastellarButtonRN = exports.useIntastellarRN = exports.IntastellarButton = exports.useIntastellar = exports.IntastellarAPI = void 0;
// Main exports - automatically detects environment
__exportStar(require("./types"), exports);
var api_1 = require("./api");
Object.defineProperty(exports, "IntastellarAPI", { enumerable: true, get: function () { return api_1.IntastellarAPI; } });
// React exports
var react_1 = require("./react");
Object.defineProperty(exports, "useIntastellar", { enumerable: true, get: function () { return react_1.useIntastellar; } });
Object.defineProperty(exports, "IntastellarButton", { enumerable: true, get: function () { return react_1.IntastellarButton; } });
// React Native exports (when available)
var react_native_1 = require("./react-native");
Object.defineProperty(exports, "useIntastellarRN", { enumerable: true, get: function () { return react_native_1.useIntastellarRN; } });
Object.defineProperty(exports, "IntastellarButtonRN", { enumerable: true, get: function () { return react_native_1.IntastellarButton; } });
