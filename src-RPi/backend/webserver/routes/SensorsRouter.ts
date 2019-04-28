import express = require("express");
import { SensorController } from "../controller/SensorsController"

const router : express.Router = express.Router();

router.get('/', SensorController.get_all);

router.get('/available', SensorController.get_available_sensors);

router.get('/pin/:dataPin', SensorController.get_by_data_pin);

router.get('/type/:sensorType', SensorController.get_by_type);

router.post('/', SensorController.post);

router.get('/:sensorId', SensorController.get_by_id);

router.patch('/:sensorId', SensorController.patch);

router.delete('/:sensorId', SensorController.delete);

export { router };
