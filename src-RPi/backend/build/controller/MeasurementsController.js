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
var Measurement_1 = require("../entity/Measurement");
var Sensors_1 = require("../entity/Sensors");
var MeasurementController = (function () {
    function MeasurementController() {
    }
    MeasurementController.getAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Measurement_1.Measurement)];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    MeasurementController.getByPlantId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, plantId, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        plantId = req.params.plantId;
                        return [4, manager.find(Measurement_1.Measurement, {
                                where: {
                                    plantId: plantId
                                }
                            })];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    MeasurementController.getByPlantIdAndType = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var type, plantId, manager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = req.params.sensorType;
                        plantId = req.params.plantId;
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Measurement_1.Measurement, {
                                where: {
                                    plantId: plantId,
                                    sensorType: type
                                }
                            })];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    MeasurementController.getById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, manager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.measurementId;
                        manager = typeorm_1.getManager();
                        return [4, manager.findOne(Measurement_1.Measurement, id)];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    MeasurementController.getBySensorId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var sensorId, manager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sensorId = req.params.sensorId;
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Measurement_1.Measurement, {
                                where: {
                                    sensorId: sensorId
                                }
                            })];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    MeasurementController.getBySensorIdAndPlantId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var sensorId, plantId, manager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sensorId = req.params.sensorId;
                        plantId = req.params.plantId;
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Measurement_1.Measurement, {
                                where: {
                                    sensorId: sensorId,
                                    plantId: plantId
                                }
                            })];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    MeasurementController.post = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, newMeasurement, sensor, result, postedEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        newMeasurement = manager.create(Measurement_1.Measurement, req.body);
                        return [4, manager.findOne(Sensors_1.Sensor, newMeasurement.sensorId)];
                    case 1:
                        sensor = _a.sent();
                        newMeasurement.sensorType = sensor.type;
                        newMeasurement.plantId = sensor.currentPlantId;
                        newMeasurement.measuredAt = newMeasurement.measuredAt || (new Date()).toISOString();
                        return [4, manager.insert(Measurement_1.Measurement, newMeasurement)];
                    case 2:
                        result = _a.sent();
                        return [4, manager.findOne(Measurement_1.Measurement, result.identifiers[0].id)];
                    case 3:
                        postedEntity = _a.sent();
                        res.send(postedEntity);
                        return [2];
                }
            });
        });
    };
    MeasurementController.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, manager, deleteEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.measurementId;
                        manager = typeorm_1.getManager();
                        return [4, manager.findOne(Measurement_1.Measurement, id)];
                    case 1:
                        deleteEntity = _a.sent();
                        return [4, manager.delete(Measurement_1.Measurement, id)];
                    case 2:
                        _a.sent();
                        res.send(deleteEntity);
                        return [2];
                }
            });
        });
    };
    return MeasurementController;
}());
exports.MeasurementController = MeasurementController;
//# sourceMappingURL=MeasurementsController.js.map