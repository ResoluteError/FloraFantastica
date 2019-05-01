"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var SensorsController_1 = require("../controller/SensorsController");
var router = express.Router();
exports.router = router;
router.get('/', SensorsController_1.SensorController.get_all);
router.get('/available', SensorsController_1.SensorController.get_available_sensors);
router.get('/pin/:dataPin', SensorsController_1.SensorController.get_by_data_pin);
router.get('/type/:sensorType', SensorsController_1.SensorController.get_by_type);
router.post('/', SensorsController_1.SensorController.post);
router.get('/:sensorId', SensorsController_1.SensorController.get_by_id);
router.patch('/:sensorId', SensorsController_1.SensorController.patch);
router.delete('/:sensorId', SensorsController_1.SensorController.delete);
//# sourceMappingURL=SensorsRouter.js.map