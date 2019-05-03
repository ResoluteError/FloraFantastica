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
var Measurement_1 = require("../entities/Measurement");
var Sensors_1 = require("../entities/Sensors");
var request = require("request");
var config_1 = require("../config");
var QueueItem_model_1 = require("../models/QueueItem.model");
var SerialCommunication_model_1 = require("../models/SerialCommunication.model");
var MeasurementsController_1 = require("./MeasurementsController");
var Actions_1 = require("../entities/Actions");
var Plants_1 = require("../entities/Plants");
var ActionsController = (function () {
    function ActionsController() {
    }
    ActionsController.getAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Actions_1.Action)];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    ActionsController.getById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, id, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        id = req.params.actionId;
                        return [4, manager.findOne(Actions_1.Action, id)];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    ActionsController.getByState = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, state, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        state = req.params.state;
                        return [4, manager.find(Actions_1.Action, { where: { state: state } })];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    ActionsController.getByPlantId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, plantId, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        plantId = req.params.plantId;
                        return [4, manager.find(Actions_1.Action, { where: { plantId: plantId } })];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    ActionsController.getLatestByPlantId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, plantId, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        plantId = req.params.plantId;
                        return [4, manager.query("SELECT * FROM action WHERE plantId='" + plantId + "' ORDER BY createdAt DESC LIMIT 1")];
                    case 1:
                        data = _a.sent();
                        if (data && data.length === 1) {
                            data = data[0];
                        }
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    ActionsController.getByStateAndPlantId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, plantId, state, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        plantId = req.params.plantId;
                        state = req.params.state;
                        return [4, manager.find(Actions_1.Action, { where: { plantId: plantId, state: state } })];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    ActionsController.patch = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, actionId, editAction, patchActionRes, patchedAction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        actionId = req.params.actionId;
                        editAction = manager.create(Actions_1.Action, req.body);
                        return [4, manager.update(Actions_1.Action, actionId, editAction)];
                    case 1:
                        patchActionRes = _a.sent();
                        return [4, manager.findOne(Actions_1.Action, actionId)];
                    case 2:
                        patchedAction = _a.sent();
                        res.send(patchedAction);
                        return [2];
                }
            });
        });
    };
    ActionsController.postHealthEntry = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, plantId, sensorId, sensor, result, newMeasurement, postedHealthEntry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        plantId = req.params.plantId;
                        return [4, manager.findOne(Sensors_1.Sensor, {
                                where: {
                                    currentPlantId: plantId,
                                    type: 90
                                }
                            })];
                    case 1:
                        sensor = _a.sent();
                        if (!!sensor) return [3, 4];
                        return [4, manager.insert(Sensors_1.Sensor, {
                                currentPlantId: plantId,
                                name: "Health Entries",
                                dataPin: null,
                                powerPin: null,
                                type: 90,
                                state: 0
                            })];
                    case 2:
                        result = _a.sent();
                        sensorId = result.identifiers[0].id;
                        return [4, manager.findOne(Sensors_1.Sensor, sensorId)];
                    case 3:
                        sensor = _a.sent();
                        return [3, 5];
                    case 4:
                        sensorId = sensor.id;
                        _a.label = 5;
                    case 5:
                        newMeasurement = {
                            sensorId: sensorId,
                            sensorType: 90,
                            plantId: plantId,
                            measuredAt: (new Date()).toISOString(),
                            data: req.body.data
                        };
                        return [4, MeasurementsController_1.MeasurementController.createNewMeasurement(newMeasurement, sensor.currentPlantId, sensor)];
                    case 6:
                        postedHealthEntry = _a.sent();
                        res.send(postedHealthEntry);
                        return [2];
                }
            });
        });
    };
    ActionsController.checkSensor = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, sensorId, action, sensor, measurementRequest, sensorReqOptions;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        sensorId = req.params.sensorId;
                        action = req.params.sensorAction;
                        return [4, manager.findOne(Sensors_1.Sensor, sensorId)];
                    case 1:
                        sensor = _a.sent();
                        measurementRequest = {
                            origin: QueueItem_model_1.QueueItemOrigin.Webserver,
                            type: SerialCommunication_model_1.SerialRequestType.Measurement,
                            sensorId: sensorId,
                            sensorType: sensor.type,
                            dataPin: sensor.dataPin,
                            powerPin: sensor.powerPin
                        };
                        sensorReqOptions = {
                            url: "http://localhost:" + config_1.CONFIG.QUEUE_MANAGER_PORT + "/queue",
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Accept-Charset': 'utf-8'
                            },
                            json: measurementRequest
                        };
                        request(sensorReqOptions, function (err, measureRes, body) { return __awaiter(_this, void 0, void 0, function () {
                            var updatedSensor, newMeasurement, measurement;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (err || (measureRes && measureRes.statusCode >= 400) || typeof measureRes === "undefined") {
                                            res.status((measureRes && measureRes.statusCode) || 400).send(err || "{}");
                                            return [2];
                                        }
                                        if (!(action === "check")) return [3, 2];
                                        sensor.state = 2;
                                        return [4, manager.save(sensor)];
                                    case 1:
                                        updatedSensor = _a.sent();
                                        res.send(sensor);
                                        return [3, 5];
                                    case 2:
                                        if (!(action === "measure")) return [3, 4];
                                        newMeasurement = {
                                            sensorId: sensor.id,
                                            sensorType: sensor.type,
                                            data: body.data,
                                            plantId: sensor.currentPlantId,
                                            measuredAt: new Date().toISOString(),
                                            id: null
                                        };
                                        return [4, manager.insert(Measurement_1.Measurement, newMeasurement)];
                                    case 3:
                                        measurement = _a.sent();
                                        res.status(202).send(newMeasurement);
                                        return [3, 5];
                                    case 4:
                                        console.log("Action not found: ", action);
                                        _a.label = 5;
                                    case 5: return [2];
                                }
                            });
                        }); });
                        return [2];
                }
            });
        });
    };
    ActionsController.postAction = function (actionRequest, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var actionReqOptions, manager;
            var _this = this;
            return __generator(this, function (_a) {
                actionReqOptions = {
                    url: "http://localhost:" + config_1.CONFIG.QUEUE_MANAGER_PORT + "/queue",
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Accept-Charset': 'utf-8'
                    },
                    json: actionRequest
                };
                manager = typeorm_1.getManager();
                request(actionReqOptions, function (err, httpResponse, body) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!err) return [3, 2];
                                console.log("postAction Error - ", err);
                                return [4, manager.update(Actions_1.Action, actionRequest.id, {
                                        state: -1
                                    })];
                            case 1:
                                _a.sent();
                                console.log("Action updated with error");
                                return [2];
                            case 2: return [4, manager.update(Actions_1.Action, actionRequest.id, {
                                    state: 1
                                })];
                            case 3:
                                _a.sent();
                                console.log("Action updated with success");
                                console.log("Completed action request");
                                if (callback) {
                                    callback(actionRequest);
                                }
                                return [2];
                        }
                    });
                }); });
                return [2];
            });
        });
    };
    ActionsController.wateringAction = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var duration, actionPin, plantId, manager, action, savedActionRes, actionId, resultAction, wateringRequest;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        duration = +req.params.duration;
                        actionPin = +req.params.actionPin;
                        plantId = req.params.plantId;
                        manager = typeorm_1.getManager();
                        action = manager.create(Actions_1.Action, {
                            actionType: 0,
                            actionPin: actionPin,
                            activationType: 2,
                            duration: duration,
                            plantId: plantId
                        });
                        return [4, manager.insert(Actions_1.Action, action)];
                    case 1:
                        savedActionRes = _a.sent();
                        actionId = savedActionRes.identifiers[0].id;
                        return [4, manager.findOne(Actions_1.Action, actionId)];
                    case 2:
                        resultAction = _a.sent();
                        wateringRequest = {
                            id: actionId,
                            origin: QueueItem_model_1.QueueItemOrigin.Webserver,
                            type: SerialCommunication_model_1.SerialRequestType.Action,
                            actionType: SerialCommunication_model_1.SerialActionType.Watering,
                            activationType: SerialCommunication_model_1.SerialActionActivationType.Duration,
                            actionPin: actionPin,
                            duration: duration
                        };
                        ActionsController.postAction(wateringRequest, function (actionRequest) { return __awaiter(_this, void 0, void 0, function () {
                            var manager, sensor, wateringMeasurement, insertResponse, plant, cData;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        manager = typeorm_1.getManager();
                                        return [4, manager.findOne(Sensors_1.Sensor, { where: { currentPlantId: plantId, type: 40 } })];
                                    case 1:
                                        sensor = _a.sent();
                                        wateringMeasurement = manager.create(Measurement_1.Measurement, {
                                            sensorId: sensor.id,
                                            sensorType: 40,
                                            plantId: plantId,
                                            measuredAt: new Date().toISOString(),
                                            data: +duration
                                        });
                                        console.log("Saving Watering Measurement after Watering Action");
                                        console.log("wateringMeasurement - ", wateringMeasurement);
                                        return [4, manager.insert(Measurement_1.Measurement, wateringMeasurement)];
                                    case 2:
                                        insertResponse = _a.sent();
                                        return [4, manager.findOne(Plants_1.Plant, plantId)];
                                    case 3:
                                        plant = _a.sent();
                                        cData = JSON.parse(plant.currentData);
                                        wateringMeasurement.id = insertResponse.identifiers[0].id;
                                        cData[40] = wateringMeasurement;
                                        return [4, manager.update(Plants_1.Plant, plantId, {
                                                currentData: JSON.stringify(cData)
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        }); });
                        res.status(202).send(resultAction);
                        return [2];
                }
            });
        });
    };
    return ActionsController;
}());
exports.ActionsController = ActionsController;
//# sourceMappingURL=ActionsController.js.map