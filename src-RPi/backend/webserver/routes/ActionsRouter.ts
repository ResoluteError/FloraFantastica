import express = require("express");
import { ActionsController } from "../controller/ActionsController";
import { Authorizer } from "../auth/authorizer";

const router : express.Router = express.Router();

router.get("/", ActionsController.getAll);

router.get("/:actionId", ActionsController.getById);

router.patch("/:actionId", Authorizer.IsSimpleAuthorized, ActionsController.patch);

router.get("/state/:state", ActionsController.getByState);

router.get("/plant/:plantId", ActionsController.getByPlantId);

router.get("/plant/:plantId/latest", ActionsController.getLatestByPlantId);

router.get("/state/:state/plant/:plantId", ActionsController.getByStateAndPlantId);

router.post("/plant/:plantId/post-health-entry", Authorizer.IsSimpleAuthorized, ActionsController.postHealthEntry);

router.post("/sensor/:sensorId/:sensorAction", Authorizer.IsSimpleAuthorized, ActionsController.checkSensor);

router.post("/watering/pin/:actionPin/duration/:duration/plant/:plantId", Authorizer.IsSimpleAuthorized, ActionsController.wateringAction);

export {router};