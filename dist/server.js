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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var express_1 = __importDefault(require("express"));
var EngineConfig_1 = require("./classes/EngineConfig");
var EngineRoute_1 = require("./classes/EngineRoute");
exports.checkRoute = EngineRoute_1.checkRoute;
var ServerInstance = /** @class */ (function () {
    function ServerInstance() {
        this.running = false;
        this._app = express_1.default();
    }
    ServerInstance.prototype.start = function (callback) {
        var _this = this;
        if (callback) {
            if (this._config) {
                this._server = this._app.listen(this._config.port);
                this._server.on('listening', function () {
                    _this.running = true;
                    callback("running on port " + _this._config.port, null);
                });
                this._server.on('error', function (err) {
                    _this.running = false;
                    callback(null, "error:" + err.code);
                });
            }
            else {
                this.running = false;
                callback(null, 'create it first..');
            }
        }
        else {
            return new Promise(function (resolve, reject) {
                if (_this._config) {
                    _this._server = _this._app.listen(_this._config.port);
                    _this._server.on('listening', function () {
                        _this.running = true;
                        resolve("running on port " + _this._config.port);
                    });
                    _this._server.on('error', function (err) {
                        _this.running = false;
                        reject("error:" + err.code);
                    });
                }
                else {
                    _this.running = false;
                    reject('create it first..');
                }
            });
        }
    };
    ServerInstance.prototype.stop = function (callback) {
        var error = null;
        var result = null;
        try {
            this._server.close();
            result = "engine stopped";
        }
        catch (err) {
            error = "error stopping engine: " + err;
        }
        if (callback) {
            if (error) {
                callback(null, error);
            }
            else {
                callback(result, null);
            }
        }
        else {
            return new Promise(function (resolve, reject) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        }
    };
    ServerInstance.prototype.changeResponse = function (method, path, responseName, callback) {
        var error = null;
        var result = null;
        var routeFound;
        if (!this._config) {
            error = "no engine created!";
        }
        else if (this.running !== true) {
            error = "engine not running!";
        }
        else {
            var engineRoutes = this._config.routes;
            routeFound = engineRoutes.find(function (r) { return ((!r.method && method === 'GET') || (r.method === method)) && r.path === path; });
            if (!routeFound) {
                error = "no \"" + method + " " + path + "\" route!";
            }
            else if (!routeFound.responses.hasOwnProperty(responseName)) {
                error = "no response with name \"" + responseName + "\"!";
            }
            else {
                routeFound.currentResponse = responseName;
                result = "changed response on \"" + method + " " + path + "\" to \"" + responseName + "\"";
            }
        }
        if (callback) {
            if (error) {
                callback(null, error);
            }
            else {
                callback(result, null);
            }
        }
        else {
            return new Promise(function (resolve, reject) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        }
    };
    ServerInstance.prototype.create = function (config, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var error, result, configCheck, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = null;
                        result = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, EngineConfig_1.checkConfig(config)];
                    case 2:
                        configCheck = _a.sent();
                        console.log('configCheck:', configCheck);
                        this._config = config;
                        /*      setting keep-alive to false     */
                        this._app.use(function (req, res, next) {
                            res.setHeader('Connection', 'close');
                            next();
                        });
                        this._app.get('/favicon.ico', function (req, res) {
                            res.sendFile(__dirname.concat('/favicon.ico'));
                        });
                        /*      handling requests     */
                        this._app.use('/', function (req, res) {
                            console.log(req.method + "->" + req.path);
                            var reqPath = req.path;
                            var reqMethod = req.method;
                            var engineRoutes = config.routes;
                            var responseFound = engineRoutes.find(function (r) { return (!r.method || r.method === reqMethod) && r.path === reqPath; });
                            var currentResponse = null;
                            if (!responseFound || !responseFound.responses || Object.prototype.toString.call(responseFound.responses) !== '[object Object]' || Object.entries(responseFound.responses).length === 0) {
                                currentResponse = config.fallback;
                            }
                            else {
                                if (responseFound.currentResponse && responseFound.responses[responseFound.currentResponse]) {
                                    currentResponse = responseFound.responses[responseFound.currentResponse];
                                }
                                else if (responseFound.responses['default']) {
                                    currentResponse = responseFound.responses['default'];
                                }
                                else {
                                    currentResponse = Object.entries(responseFound.responses)[0][1];
                                }
                            }
                            if (Object.prototype.toString.call(currentResponse) === '[object Object]' || Object.prototype.toString.call(currentResponse) === '[object Array]') {
                                res.json(currentResponse);
                            }
                            else if (Object.prototype.toString.call(currentResponse) === '[object String]' || Object.prototype.toString.call(currentResponse) === '[object Number]') {
                                res.send(currentResponse.toString());
                            }
                            else {
                                console.log('could not determine type of response! is it JSON, is it a string, a number..?');
                            }
                        });
                        result = 'engine created';
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        error = err_1;
                        return [3 /*break*/, 4];
                    case 4:
                        if (callback) {
                            if (error) {
                                callback(null, error);
                            }
                            else {
                                callback(result, null);
                            }
                        }
                        else {
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    if (error) {
                                        reject(error);
                                    }
                                    else {
                                        resolve(result);
                                    }
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return ServerInstance;
}());
exports.ServerInstance = ServerInstance;
