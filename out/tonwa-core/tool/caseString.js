"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelCase = exports.capitalCase = void 0;
function capitalCase(s) {
    let parts = s.split(/[-._]/);
    return parts.map(v => firstCharUppercase(v)).join('_');
}
exports.capitalCase = capitalCase;
function camelCase(s) {
    let parts = s.split(/[-._]/);
    let len = parts.length;
    parts[0] = firstCharLowercase(parts[0]);
    for (let i = 1; i < len; i++) {
        parts[1] = firstCharUppercase(parts[1]);
    }
    return parts.join('_');
}
exports.camelCase = camelCase;
const aCode = 'a'.charCodeAt(0);
const zCode = 'z'.charCodeAt(0);
function firstCharUppercase(s) {
    if (!s)
        return '';
    let c = s.charCodeAt(0);
    if (c >= aCode && c <= zCode) {
        return String.fromCharCode(c - 0x20) + s.substr(1);
    }
    return s;
}
const ACode = 'A'.charCodeAt(0);
const ZCode = 'Z'.charCodeAt(0);
function firstCharLowercase(s) {
    if (!s)
        return '';
    let c = s.charCodeAt(0);
    if (c >= ACode && c <= ZCode) {
        return String.fromCharCode(c + 0x20) + s.substr(1);
    }
    return s;
}
//# sourceMappingURL=caseString.js.map