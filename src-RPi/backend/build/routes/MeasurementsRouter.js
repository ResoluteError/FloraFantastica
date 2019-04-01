"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var MeasurementsController_1 = require("../controller/MeasurementsController");
var router = express.Router();
exports.router = router;
router.get("/", MeasurementsController_1.MeasurementController.getAll);
router.post("/", MeasurementsController_1.MeasurementController.post);
router.get("/:measurementId", MeasurementsController_1.MeasurementController.getById);
router.get("/plant/:plantId", MeasurementsController_1.MeasurementController.getByPlantId);
router.get("/type/:sensorType/plant/:plantId", MeasurementsController_1.MeasurementController.getByPlantIdAndType);
router.get("/sensor/:sensorId", MeasurementsController_1.MeasurementController.getBySensorId);
router.get("/sensor/:sensorId/plant/:plantId", MeasurementsController_1.MeasurementController.getBySensorIdAndPlantId);
router.delete("/:measurementId", MeasurementsController_1.MeasurementController.delete);
//# sourceMappingURL=MeasurementsRouter.js.map