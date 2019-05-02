"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ActionsController_1 = require("../controller/ActionsController");
var router = express.Router();
exports.router = router;
router.post("/plant/:plantId/post-health-entry", ActionsController_1.ActionsController.postHealthEntry);
router.post("/sensor/:sensorId/:sensorAction", ActionsController_1.ActionsController.checkSensor);
//# sourceMappingURL=ActionsRouter.js.map