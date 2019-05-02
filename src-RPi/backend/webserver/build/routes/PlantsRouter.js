"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var PlantsController_1 = require("../controller/PlantsController");
var SensorsController_1 = require("../controller/SensorsController");
var multer = require("multer");
var upload = multer();
var router = express.Router();
exports.router = router;
router.get('/', PlantsController_1.PlantsController.getAll);
router.post('/', upload.single("plantImageUpload"), PlantsController_1.PlantsController.post);
router.get('/:plantId', PlantsController_1.PlantsController.getById);
router.patch('/:plantId', upload.single("plantImageUpload"), PlantsController_1.PlantsController.patch);
router.delete('/:plantId', PlantsController_1.PlantsController.delete);
router.get('/:plantId/sensors', SensorsController_1.SensorController.getByPlantId);
//# sourceMappingURL=PlantsRouter.js.map