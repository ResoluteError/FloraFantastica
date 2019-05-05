import express = require("express");
import { MeasurementController } from "../controller/MeasurementsController";
import { Authorizer } from "../auth/authorizer";

const router : express.Router = express.Router();

router.get( "/", MeasurementController.getAll );

router.post( "/",  Authorizer.IsSimpleAuthorized, MeasurementController.post );

router.get( "/:measurementId", MeasurementController.getById );

router.get( "/plant/:plantId", MeasurementController.getByPlantId );

router.get( "/type/:sensorType/plant/:plantId", MeasurementController.getByPlantIdAndType );

router.get( "/sensor/:sensorId", MeasurementController.getBySensorId );

router.get( "/sensor/:sensorId/plant/:plantId", MeasurementController.getBySensorIdAndPlantId );

router.delete("/:measurementId", Authorizer.IsSimpleAuthorized, MeasurementController.delete );

export {router};