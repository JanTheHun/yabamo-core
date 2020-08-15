"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EngineRoute_1 = require("./EngineRoute");
function checkConfig(config) {
    return new Promise(function (resolve, reject) {
        if (!config) {
            reject('no config');
        }
        if (!config.engineName) {
            reject('no engineName');
        }
        if (!config.port) {
            reject('no port number');
        }
        if (isNaN(config.port)) {
            reject('port must be a number');
        }
        if (!config.routes) {
            reject('must provide some routes');
        }
        if (Object.prototype.toString.call(config.routes) !== '[object Array]') {
            reject('routes must be Array');
        }
        config.routes.forEach(function (r) {
            EngineRoute_1.checkRoute(r)
                .then(function (res) {
                console.log("checking \"" + (r.method ? r.method : 'GET') + "->" + r.path + "\": " + res);
            })
                .catch(function (err) {
                reject(err);
            });
        });
        resolve('config looks good');
    });
}
exports.checkConfig = checkConfig;
