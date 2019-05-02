import express = require("express");
import { PlantsController } from "../controller/PlantsController"
import { SensorController } from "../controller/SensorsController";
import multer = require('multer');

let upload = multer();

const router : express.Router = express.Router();

router.get('/', PlantsController.getAll);

router.post('/', upload.single("plantImageUpload"), PlantsController.post);

router.get('/:plantId', PlantsController.getById);

router.patch('/:plantId', upload.single("plantImageUpload"), PlantsController.patch);

router.delete('/:plantId', PlantsController.delete);

router.get('/:plantId/sensors', SensorController.getByPlantId);

export { router };
