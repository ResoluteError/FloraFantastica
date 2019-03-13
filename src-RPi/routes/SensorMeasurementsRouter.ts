import express = require("express");
import { SensorMeasurementController } from "../controller/sensorMeasurementsController";

const router : express.Router = express.Router();

router.get( "/", SensorMeasurementController.getAll );

router.get( "/type/:sensorType", SensorMeasurementController.getByType );

router.get("/sensor/:sensorId", SensorMeasurementController.getById );

router.delete("/measurement/:measurementId", SensorMeasurementController.delete );

export {router};