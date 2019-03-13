import express = require("express");
import { SensorMeasurementController } from "../controller/sensorMeasurementsController";

const router : express.Router = express.Router();

router.get( "/", SensorMeasurementController.getAll );

router.post( "/", SensorMeasurementController.post );

router.get( "/:measurementId", SensorMeasurementController.getById );

router.get( "/plant/:plantId", SensorMeasurementController.getByPlantId );

router.get( "/type/:sensorType/plant/:plantId", SensorMeasurementController.getByPlantIdAndType );

router.get( "/sensor/:sensorId", SensorMeasurementController.getBySensorId );

router.get( "/sensor/:sensorId/plant/:plantId", SensorMeasurementController.getBySensorIdAndPlantId );

router.delete("/measurement/:measurementId", SensorMeasurementController.delete );

export {router};