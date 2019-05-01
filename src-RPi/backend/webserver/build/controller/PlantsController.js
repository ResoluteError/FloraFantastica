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
var fs = require("fs");
var config_1 = require("../config");
var PlantsController = (function () {
    function PlantsController() {
    }
    PlantsController.get_all = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var manager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        manager = typeorm_1.getManager();
                        return [4, manager.find(Plants_1.Plant)];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    PlantsController.get_by_id = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, manager, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.plantId;
                        manager = typeorm_1.getManager();
                        return [4, manager.findOne(Plants_1.Plant, id)];
                    case 1:
                        data = _a.sent();
                        res.send(data);
                        return [2];
                }
            });
        });
    };
    PlantsController.post = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var plantData, folder, savePath, manager, plant, result, createdId, createdEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        plantData = req.body;
                        try {
                            folder = Date.now();
                            plantData.icon = "/uploads/" + folder + "/" + req.file.originalname;
                            savePath = config_1.CONFIG.UPLOADS_DIR + "/" + folder + "/";
                            fs.mkdirSync(savePath, { recursive: true });
                            fs.writeFileSync(savePath + req.file.originalname, req.file.buffer);
                        }
                        catch (err) {
                        }
                        plantData.state = plantData.state || 0;
                        plantData.currentData = plantData.currentData || "{}";
                        manager = typeorm_1.getManager();
                        plant = manager.create(Plants_1.Plant, plantData);
                        return [4, manager.insert(Plants_1.Plant, plant)];
                    case 1:
                        result = _a.sent();
                        createdId = result.identifiers[0].id;
                        return [4, manager.findOne(Plants_1.Plant, createdId)];
                    case 2:
                        createdEntity = _a.sent();
                        res.send(createdEntity);
                        return [2];
                }
            });
        });
    };
    PlantsController.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, manager, deletingEntity, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.plantId;
                        manager = typeorm_1.getManager();
                        return [4, manager.findOne(Plants_1.Plant, id)];
                    case 1:
                        deletingEntity = _a.sent();
                        return [4, manager.delete(Plants_1.Plant, id)];
                    case 2:
                        result = _a.sent();
                        res.send(deletingEntity);
                        return [2];
                }
            });
        });
    };
    PlantsController.patch = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, manager, plantData, folder, savePath, result, updatedEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.plantId;
                        manager = typeorm_1.getManager();
                        plantData = manager.create(Plants_1.Plant, req.body);
                        try {
                            folder = Date.now();
                            plantData.icon = "/uploads/" + folder + "/" + req.file.originalname;
                            savePath = config_1.CONFIG.UPLOADS_DIR + "/" + folder + "/";
                            fs.mkdirSync(savePath, { recursive: true });
                            fs.writeFileSync(savePath + req.file.originalname, req.file.buffer);
                        }
                        catch (err) {
                        }
                        return [4, manager.update(Plants_1.Plant, id, plantData)];
                    case 1:
                        result = _a.sent();
                        return [4, manager.findOne(Plants_1.Plant, id)];
                    case 2:
                        updatedEntity = _a.sent();
                        res.send(updatedEntity);
                        return [2];
                }
            });
        });
    };
    return PlantsController;
}());
exports.PlantsController = PlantsController;
//# sourceMappingURL=PlantsController.js.map