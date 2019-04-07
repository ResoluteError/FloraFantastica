"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var config_1 = require("./config");
var rxjs_1 = require("rxjs");
(function () {
    return __awaiter(this, void 0, void 0, function () {
        function parseCliArguments() {
            var ArgsLength = process.argv.length;
            var execArgs = {};
            var currentArg = 2;
            for (var currentArg = 2, ArgsLength = process.argv.length; currentArg < ArgsLength; currentArg++) {
                var str = process.argv[currentArg].replace(" ", "");
                var key = str.split("=")[0].toLowerCase();
                var valStr = str.split("=")[1];
                var val;
                if (valStr.indexOf("/") > -1) {
                    val = valStr.split("/");
                }
                else {
                    val = valStr;
                }
                execArgs[key] = val;
            }
            return execArgs;
        }
        function getSensorsByType(type) {
            return new rxjs_1.Observable(function (observer) {
                request.get("http://localhost:" + config_1.CONFIG.WEBSERVER_PORT + "/api/sensors/type/" + type, function (err, httpResponse, body) {
                    if (err) {
                        observer.error(err);
                        observer.complete();
                        return;
                    }
                    observer.next(body);
                    observer.complete();
                });
            });
        }
        function getAllSensors() {
            return new rxjs_1.Observable(function (observer) {
                request.get("http://localhost:" + config_1.CONFIG.WEBSERVER_PORT + "/api/sensors", function (err, httpResponse, body) {
                    if (err) {
                        observer.error(err);
                        observer.complete();
                        return;
                    }
                    console.log("Body: ", body);
                    observer.next(body);
                    observer.complete();
                });
            });
        }
        function requestSensorMeasurement(sensor) {
            return new rxjs_1.Observable(function (observer) {
                request.post("http://localhost:" + config_1.CONFIG.QUEUE_MANAGER_PORT + "/queue", {
                    json: {
                        type: "cron",
                        sensorId: sensor.id,
                        sensorType: sensor.type,
                        pin: sensor.pin
                    }
                }, function (err, httpResponse, body) {
                    if (err) {
                        observer.error(err);
                        observer.complete();
                        return;
                    }
                    observer.next(body);
                    observer.complete();
                });
            });
        }
        function checkSensors(sensors) {
            for (var _i = 0, sensors_1 = sensors; _i < sensors_1.length; _i++) {
                var sensor = sensors_1[_i];
                if (sensor.currentPlantId) {
                    if (sensor.state === 2) {
                        requestSensorMeasurement(sensor);
                    }
                }
            }
        }
        var args, _i, _a, type, sensors;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    args = parseCliArguments();
                    console.log("args: ", args);
                    if (!(typeof args["types"] === "string")) return [3, 1];
                    getAllSensors().subscribe(function (sensors) {
                        var sensorArr = JSON.parse(sensors);
                        console.log("all sensors: ", sensorArr, typeof sensorArr);
                        checkSensors(sensorArr);
                    });
                    return [3, 5];
                case 1:
                    _i = 0, _a = args["types"];
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3, 5];
                    type = _a[_i];
                    return [4, getSensorsByType(type).toPromise()];
                case 3:
                    sensors = _b.sent();
                    console.log("typed ", type, " sensors: ", sensors);
                    checkSensors(sensors);
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3, 2];
                case 5: return [2];
            }
        });
    });
})();
//# sourceMappingURL=sensorCheck.js.map