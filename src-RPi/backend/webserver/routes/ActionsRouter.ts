import express = require("express");
import { ActionsController } from "../controller/ActionsController";

const router : express.Router = express.Router();

router.post("/plant/:plantId/post-health-entry", ActionsController.postHealthEntry);

router.post("/sensor/:sensorId/:sensorAction", ActionsController.checkSensor);

export {router};