import express = require("express");
import { PlantsController } from "../controller/PlantsController"
import { SensorController } from "../controller/sensorsController";

const router : express.Router = express.Router();

router.get('/', PlantsController.get_all);

router.post('/', PlantsController.post);

router.get('/:plantId', PlantsController.get_by_id);

router.patch('/:plantId', PlantsController.patch);

router.delete('/:plantId', PlantsController.delete);

router.get('/:plantId/sensors', SensorController.get_by_plant_id);

export { router };
