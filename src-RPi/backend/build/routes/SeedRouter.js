"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var SeedDataController_1 = require("../controller/SeedDataController");
var router = express.Router();
exports.router = router;
router.get("/seed/plants", SeedDataController_1.SeedDataController.seedPlants);
router.get("/seed/sensors", SeedDataController_1.SeedDataController.seedSensors);
router.get("/seed/measurements", SeedDataController_1.SeedDataController.seedMeasurements);
router.get("/seed/view", SeedDataController_1.SeedDataController.viewData);
router.get("/seed/drop", SeedDataController_1.SeedDataController.dropSeed);
//# sourceMappingURL=SeedRouter.js.map