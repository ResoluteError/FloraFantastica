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
var typeorm_1 = require("typeorm");
var Plants_1 = require("../entities/Plants");
var Plants_2 = require("../seedData/Plants");
var Measurement_1 = require("../entities/Measurement");
var Sensors_1 = require("../entities/Sensors");
var Sensors_2 = require("../seedData/Sensors");
var Measurements_1 = require("../seedData/Measurements");
var SeedDataController = (function () {
    function SeedDataController() {
    }
    SeedDataController.seedPlants = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var plantData, manager, resultData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        plantData = Plants_2.PlantSeedData.getData();
                        manager = typeorm_1.getManager();
                        return [4, manager.insert(Plants_1.Plant, plantData)];
                    case 1:
                        _a.sent();
                        return [4, manager.find(Plants_1.Plant)];
                    case 2:
                        resultData = _a.sent();
                        res.send(resultData);
                        return [2];
                }
            });
        });
    };
    SeedDataController.seedSensors = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, plantIds, sensorData, resultData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Plants_1.Plant, {
                                select: ["id"]
                            })];
                    case 1:
                        plantIds = _a.sent();
                        sensorData = Sensors_2.SensorSeedData.getData(plantIds);
                        return [4, manager.insert(Sensors_1.Sensor, sensorData)];
                    case 2:
                        _a.sent();
                        return [4, manager.find(Sensors_1.Sensor)];
                    case 3:
                        resultData = _a.sent();
                        res.send(resultData);
                        return [2];
                }
            });
        });
    };
    SeedDataController.seedMeasurements = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, sensors, measurementData, insertBlock, resultData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Sensors_1.Sensor)];
                    case 1:
                        sensors = _a.sent();
                        measurementData = Measurements_1.MeasurementSeedData.getData(sensors);
                        _a.label = 2;
                    case 2:
                        if (!(insertBlock = measurementData.splice(0, 5)).length) return [3, 4];
                        return [4, manager.insert(Measurement_1.Measurement, insertBlock)];
                    case 3:
                        _a.sent();
                        return [3, 2];
                    case 4: return [4, manager.find(Measurement_1.Measurement)];
                    case 5:
                        resultData = _a.sent();
                        res.send(resultData);
                        return [2];
                }
            });
        });
    };
    SeedDataController.dropSeed = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var con;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        con = typeorm_1.getConnection();
                        return [4, con.synchronize(true)];
                    case 1:
                        _a.sent();
                        res.send("Reset Databases");
                        return [2];
                }
            });
        });
    };
    SeedDataController.viewData = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, plants, measurements, sensors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Plants_1.Plant)];
                    case 1:
                        plants = _a.sent();
                        return [4, manager.find(Measurement_1.Measurement)];
                    case 2:
                        measurements = _a.sent();
                        return [4, manager.find(Sensors_1.Sensor)];
                    case 3:
                        sensors = _a.sent();
                        res.send({ plants: plants, measurements: measurements, sensors: sensors });
                        return [2];
                }
            });
        });
    };
    return SeedDataController;
}());
exports.SeedDataController = SeedDataController;
//# sourceMappingURL=SeedDataController.js.map