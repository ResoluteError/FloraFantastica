"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var PlantsController_1 = require("../controller/PlantsController");
var SensorsController_1 = require("../controller/SensorsController");
var multer = require("multer");
var authorizer_1 = require("../auth/authorizer");
var upload = multer();
var router = express.Router();
exports.router = router;
router.get('/', PlantsController_1.PlantsController.getAll);
router.post('/', authorizer_1.Authorizer.IsSimpleAuthorized, upload.single("plantImageUpload"), PlantsController_1.PlantsController.post);
router.get('/:plantId', PlantsController_1.PlantsController.getById);
router.patch('/:plantId', authorizer_1.Authorizer.IsSimpleAuthorized, upload.single("plantImageUpload"), PlantsController_1.PlantsController.patch);
router.delete('/:plantId', authorizer_1.Authorizer.IsSimpleAuthorized, PlantsController_1.PlantsController.delete);
router.get('/:plantId/sensors', SensorsController_1.SensorController.getByPlantId);
//# sourceMappingURL=PlantsRouter.js.map