import express = require("express");
import { SensorController } from "../controller/SensorsController"

const router : express.Router = express.Router();

router.get('/', SensorController.getAll);

router.get('/available', SensorController.getAvailableSensors);

router.get('/pin/:dataPin', SensorController.getByDataPin);

router.get('/type/:sensorType', SensorController.getByType);

router.post('/', SensorController.post);

router.get('/:sensorId', SensorController.getById);

router.patch('/:sensorId', SensorController.patch);

router.delete('/:sensorId', SensorController.delete);

export { router };
