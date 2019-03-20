import express = require("express");
import { SensorController } from "../controller/SensorsController"

const router : express.Router = express.Router();

router.get('/', SensorController.get_all);

router.post('/', SensorController.post);

router.get('/:sensorId', SensorController.get_by_id);

router.patch('/:sensorId', SensorController.patch);

router.delete('/:sensorId', SensorController.delete);

export { router };