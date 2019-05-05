import express = require("express");
import { SensorController } from "../controller/SensorsController"
import { Authorizer } from "../auth/authorizer";

const router : express.Router = express.Router();

router.get('/', SensorController.getAll);

router.get('/available', SensorController.getAvailableSensors);

router.get('/pin/:dataPin', SensorController.getByDataPin);

router.get('/type/:sensorType', SensorController.getByType);

router.post('/', Authorizer.IsSimpleAuthorized, SensorController.post);

router.get('/:sensorId', SensorController.getById);

router.patch('/:sensorId', Authorizer.IsSimpleAuthorized, SensorController.patch);

router.delete('/:sensorId', Authorizer.IsSimpleAuthorized, SensorController.delete);

export { router };
