import express = require("express");
import { ActionsController } from "../controller/ActionsController";

const router : express.Router = express.Router();

router.get("/", ActionsController.getAll);

router.get("/:actionId", ActionsController.getById);

router.patch("/:actionId", ActionsController.patch);

router.get("/state/:state", ActionsController.getByState);

router.get("/plant/:plantId", ActionsController.getByPlantId);

router.get("/plant/:plantId/latest", ActionsController.getLatestByPlantId);

router.get("/state/:state/plant/:plantId", ActionsController.getByStateAndPlantId);

router.post("/plant/:plantId/post-health-entry", ActionsController.postHealthEntry);

router.post("/sensor/:sensorId/:sensorAction", ActionsController.checkSensor);

router.post("/watering/pin/:actionPin/duration/:duration/plant/:plantId", ActionsController.wateringAction);

export {router};