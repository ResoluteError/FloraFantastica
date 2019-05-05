import express = require("express");
import { PlantsController } from "../controller/PlantsController"
import { SensorController } from "../controller/SensorsController";
import multer = require('multer');
import { Authorizer } from "../auth/authorizer";

let upload = multer();

const router : express.Router = express.Router();

router.get('/', PlantsController.getAll);

router.post('/', Authorizer.IsSimpleAuthorized, upload.single("plantImageUpload"), PlantsController.post);

router.get('/:plantId', PlantsController.getById);

router.patch('/:plantId',  Authorizer.IsSimpleAuthorized, upload.single("plantImageUpload"), PlantsController.patch);

router.delete('/:plantId',  Authorizer.IsSimpleAuthorized, PlantsController.delete);

router.get('/:plantId/sensors', SensorController.getByPlantId);

export { router };
