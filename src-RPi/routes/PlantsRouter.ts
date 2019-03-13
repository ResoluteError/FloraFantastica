import express = require("express");
import { PlantsController } from "../controller/PlantsController"

const router : express.Router = express.Router();

router.get('/', PlantsController.get_all);

router.post('/', PlantsController.post);

router.get('/:plantId', PlantsController.get_by_id);

router.put('/:plantId', PlantsController.put);

router.delete('/:plantId', PlantsController.delete);

export { router };
