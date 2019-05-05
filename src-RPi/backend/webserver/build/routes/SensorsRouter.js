"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var SensorsController_1 = require("../controller/SensorsController");
var authorizer_1 = require("../auth/authorizer");
var router = express.Router();
exports.router = router;
router.get('/', SensorsController_1.SensorController.getAll);
router.get('/available', SensorsController_1.SensorController.getAvailableSensors);
router.get('/pin/:dataPin', SensorsController_1.SensorController.getByDataPin);
router.get('/type/:sensorType', SensorsController_1.SensorController.getByType);
router.post('/', authorizer_1.Authorizer.IsSimpleAuthorized, SensorsController_1.SensorController.post);
router.get('/:sensorId', SensorsController_1.SensorController.getById);
router.patch('/:sensorId', authorizer_1.Authorizer.IsSimpleAuthorized, SensorsController_1.SensorController.patch);
router.delete('/:sensorId', authorizer_1.Authorizer.IsSimpleAuthorized, SensorsController_1.SensorController.delete);
//# sourceMappingURL=SensorsRouter.js.map