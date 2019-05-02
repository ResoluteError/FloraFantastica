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
var Schedules_1 = require("../entities/Schedules");
var SchedulesController = (function () {
    function SchedulesController() {
    }
    SchedulesController.getAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        console.log("Getting all schedules");
                        return [4, manager.find(Schedules_1.Schedule)];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    SchedulesController.getById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, id, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        id = req.params.scheduleId;
                        return [4, manager.findOne(Schedules_1.Schedule, id)];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    SchedulesController.getActive = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Schedules_1.Schedule, { where: { active: true } })];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    SchedulesController.getByPlantId = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, plantId, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        plantId = req.params.plantId;
                        return [4, manager.findOne(Schedules_1.Schedule, { where: { plantId: plantId } })];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    SchedulesController.post = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, schedule, creationResponse, createdId, createdSchedule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        schedule = manager.create(Schedules_1.Schedule, req.body);
                        return [4, manager.insert(Schedules_1.Schedule, schedule)];
                    case 1:
                        creationResponse = _a.sent();
                        createdId = creationResponse.identifiers[0].id;
                        return [4, manager.findOne(Schedules_1.Schedule, createdId)];
                    case 2:
                        createdSchedule = _a.sent();
                        res.send(createdSchedule);
                        return [2];
                }
            });
        });
    };
    SchedulesController.patch = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, id, schedule, result, updatedEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        id = req.params.scheduleId;
                        schedule = manager.create(Schedules_1.Schedule, req.body);
                        return [4, manager.update(Schedules_1.Schedule, id, schedule)];
                    case 1:
                        result = _a.sent();
                        return [4, manager.findOne(Schedules_1.Schedule, id)];
                    case 2:
                        updatedEntity = _a.sent();
                        res.send(updatedEntity);
                        return [2];
                }
            });
        });
    };
    SchedulesController.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, manager, deletingEntity, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.scheduleId;
                        manager = typeorm_1.getManager();
                        return [4, manager.findOne(Schedules_1.Schedule, id)];
                    case 1:
                        deletingEntity = _a.sent();
                        return [4, manager.delete(Schedules_1.Schedule, id)];
                    case 2:
                        result = _a.sent();
                        res.send(deletingEntity);
                        return [2];
                }
            });
        });
    };
    return SchedulesController;
}());
exports.SchedulesController = SchedulesController;
//# sourceMappingURL=SchedulesController.js.map