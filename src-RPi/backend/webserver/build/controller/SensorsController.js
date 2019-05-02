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
var Sensors_1 = require("../entities/Sensors");
var SensorController = (function () {
    function SensorController() {
    }
    SensorController.getAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Sensors_1.Sensor)];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    SensorController.getByPlantId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, manager, sensors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.plantId;
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Sensors_1.Sensor, {
                                where: {
                                    currentPlantId: id
                                }
                            })];
                    case 1:
                        sensors = _a.sent();
                        res.send(sensors);
                        return [2];
                }
            });
        });
    };
    SensorController.getByDataPin = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var pin, manager, sensor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pin = req.params.dataPin;
                        manager = typeorm_1.getManager();
                        return [4, manager.findOne(Sensors_1.Sensor, {
                                where: {
                                    dataPin: pin
                                }
                            })];
                    case 1:
                        sensor = _a.sent();
                        res.send(sensor);
                        return [2];
                }
            });
        });
    };
    SensorController.getAvailableSensors = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, sensors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Sensors_1.Sensor, {
                                where: [{
                                        currentPlantId: typeorm_1.IsNull(),
                                    }, {
                                        currentPlantId: "",
                                    }]
                            })];
                    case 1:
                        sensors = _a.sent();
                        res.send(sensors);
                        return [2];
                }
            });
        });
    };
    SensorController.getByType = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var type, manager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = req.params.sensorType;
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Sensors_1.Sensor, {
                                where: {
                                    type: type
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
    SensorController.getById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, manager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.sensorId;
                        manager = typeorm_1.getManager();
                        return [4, manager.findOne(Sensors_1.Sensor, id)];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    SensorController.post = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var sensorData, manager, sensor, result, createdId, createdEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sensorData = req.body;
                        manager = typeorm_1.getManager();
                        sensor = manager.create(Sensors_1.Sensor, sensorData);
                        return [4, manager.insert(Sensors_1.Sensor, sensor)];
                    case 1:
                        result = _a.sent();
                        createdId = result.identifiers[0].id;
                        return [4, manager.findOne(Sensors_1.Sensor, createdId)];
                    case 2:
                        createdEntity = _a.sent();
                        res.send(createdEntity);
                        return [2];
                }
            });
        });
    };
    SensorController.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, manager, deletingEntity, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.sensorId;
                        manager = typeorm_1.getManager();
                        return [4, manager.findOne(Sensors_1.Sensor, id)];
                    case 1:
                        deletingEntity = _a.sent();
                        return [4, manager.delete(Sensors_1.Sensor, id)];
                    case 2:
                        result = _a.sent();
                        res.send(deletingEntity);
                        return [2];
                }
            });
        });
    };
    SensorController.patch = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, manager, sensorData, result, updatedEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.sensorId;
                        manager = typeorm_1.getManager();
                        sensorData = manager.create(Sensors_1.Sensor, req.body);
                        return [4, manager.update(Sensors_1.Sensor, id, sensorData)];
                    case 1:
                        result = _a.sent();
                        return [4, manager.findOne(Sensors_1.Sensor, id)];
                    case 2:
                        updatedEntity = _a.sent();
                        res.send(updatedEntity);
                        return [2];
                }
            });
        });
    };
    return SensorController;
}());
exports.SensorController = SensorController;
//# sourceMappingURL=SensorsController.js.map