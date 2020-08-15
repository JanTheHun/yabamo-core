"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var allowedMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "*all*"];
function checkRoute(rawRoute) {
    return new Promise(function (resolve, reject) {
        if (rawRoute.hasOwnProperty("path")) {
            if (Object.prototype.toString.call(rawRoute.path) !== "[object String]") {
                reject("wrong \"path\" format on Route: " + rawRoute);
            }
        }
        else {
            reject("no \"path\" on Route: " + rawRoute);
        }
        if (rawRoute.hasOwnProperty("method")) {
            if (Object.prototype.toString.call(rawRoute.method) !== "[object String]") {
                reject("wrong \"method\" format on Route: " + rawRoute);
            }
            if (allowedMethods.indexOf(rawRoute.method) === -1) {
                reject("wrong \"method\" value on Route: " + rawRoute);
            }
        }
        if (rawRoute.hasOwnProperty("enabled")) {
            if (typeof rawRoute.enabled !== typeof true) {
                reject("\"enabled\" is not boolean on Route: " + rawRoute);
            }
        }
        if (rawRoute.hasOwnProperty("debug")) {
            if (typeof rawRoute.debug !== typeof true) {
                reject("\"debug\" is not boolean on Route: " + rawRoute);
            }
        }
        if (rawRoute.hasOwnProperty("currentResponse")) {
            if (Object.prototype.toString.call(rawRoute.currentResponse) !== "[object String]") {
                reject("wrong \"currentResponse\" format on Route: " + rawRoute);
            }
        }
        if (rawRoute.hasOwnProperty("responses")) {
            if (Object.prototype.toString.call(rawRoute.responses) !== "[object Object]") {
                reject("wrong \"responses\" format on Route: " + rawRoute);
            }
        }
        else {
            reject("no \"responses\" on Route: " + rawRoute);
        }
        resolve('route checks out');
    });
}
exports.checkRoute = checkRoute;
