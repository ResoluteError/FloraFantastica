"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ActionsController_1 = require("../controller/ActionsController");
var authorizer_1 = require("../auth/authorizer");
var router = express.Router();
exports.router = router;
router.get("/", ActionsController_1.ActionsController.getAll);
router.get("/:actionId", ActionsController_1.ActionsController.getById);
router.patch("/:actionId", authorizer_1.Authorizer.IsSimpleAuthorized, ActionsController_1.ActionsController.patch);
router.get("/state/:state", ActionsController_1.ActionsController.getByState);
router.get("/plant/:plantId", ActionsController_1.ActionsController.getByPlantId);
router.get("/plant/:plantId/latest", ActionsController_1.ActionsController.getLatestByPlantId);
router.get("/state/:state/plant/:plantId", ActionsController_1.ActionsController.getByStateAndPlantId);
router.post("/plant/:plantId/post-health-entry", authorizer_1.Authorizer.IsSimpleAuthorized, ActionsController_1.ActionsController.postHealthEntry);
router.post("/sensor/:sensorId/:sensorAction", authorizer_1.Authorizer.IsSimpleAuthorized, ActionsController_1.ActionsController.checkSensor);
router.post("/watering/pin/:actionPin/duration/:duration/plant/:plantId", authorizer_1.Authorizer.IsSimpleAuthorized, ActionsController_1.ActionsController.wateringAction);
//# sourceMappingURL=ActionsRouter.js.map