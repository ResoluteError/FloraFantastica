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
var Plants_1 = require("../entity/Plants");
var Sensors_1 = require("../entity/Sensors");
var ActionsController = (function () {
    function ActionsController() {
    }
    ActionsController.updatePlantCurrentData = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var plantId, repository, timesAndTypes, dataDict, _i, timesAndTypes_1, timeAndType, _a, _b, dataStr, manager, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        plantId = req.params.plantId;
                        repository = typeorm_1.getRepository(Measurement_1.Measurement);
                        return [4, repository.createQueryBuilder("measurement")
                                .select("MAX (measuredAt)", "measuredAt")
                                .addSelect("sensorType")
                                .where("plantId = :plantId", { plantId: plantId })
                                .groupBy("sensorType")
                                .execute()];
                    case 1:
                        timesAndTypes = _c.sent();
                        dataDict = {};
                        console.log("times and type: ", timesAndTypes);
                        _i = 0, timesAndTypes_1 = timesAndTypes;
                        _c.label = 2;
                    case 2:
                        if (!(_i < timesAndTypes_1.length)) return [3, 5];
                        timeAndType = timesAndTypes_1[_i];
                        _a = dataDict;
                        _b = timeAndType.sensorType;
                        return [4, repository.createQueryBuilder("measurement")
                                .where("plantId = :plantId", { plantId: plantId })
                                .andWhere("measuredAt = :measuredAt", { measuredAt: timeAndType.measuredAt })
                                .andWhere("sensorType = :sensorType", { sensorType: timeAndType.sensorType })
                                .getOne()];
                    case 3:
                        _a[_b] = _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3, 2];
                    case 5:
                        console.log("times and type: ", dataDict);
                        dataStr = JSON.stringify(dataDict);
                        manager = typeorm_1.getManager();
                        return [4, manager.update(Plants_1.Plant, plantId, { currentData: dataStr })];
                    case 6:
                        _c.sent();
                        return [4, manager.findOne(Plants_1.Plant, plantId)];
                    case 7:
                        result = _c.sent();
                        console.log("plant: ", result);
                        res.send(result);
                        return [2];
                }
            });
        });
    };
    ActionsController.postHealthEntry = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, plantId, sensorId, sensor, result, newMeasurement, postedEntity;
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
                        if (!!sensor) return [3, 3];
                        return [4, manager.insert(Sensors_1.Sensor, {
                                currentPlantId: plantId,
                                name: "Health Entries",
                                pin: null,
                                type: 90,
                                state: 0
                            })];
                    case 2:
                        result = _a.sent();
                        sensorId = result.identifiers[0].id;
                        return [3, 4];
                    case 3:
                        sensorId = sensor.id;
                        _a.label = 4;
                    case 4: return [4, manager.insert(Measurement_1.Measurement, {
                            sensorId: sensorId,
                            sensorType: 90,
                            plantId: plantId,
                            measuredAt: (new Date()).toISOString(),
                            data: req.body.data
                        })];
                    case 5:
                        newMeasurement = _a.sent();
                        return [4, manager.findOne(Measurement_1.Measurement, newMeasurement.identifiers[0].id)];
                    case 6:
                        postedEntity = _a.sent();
                        res.send(postedEntity);
                        return [2];
                }
            });
        });
    };
    return ActionsController;
}());
exports.ActionsController = ActionsController;
//# sourceMappingURL=ActionsController.js.map