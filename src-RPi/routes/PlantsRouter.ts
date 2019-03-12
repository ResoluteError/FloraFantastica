import express = require("express");
import { PlantsController } from "../controller/plantsController"

const router : express.Router = express.Router();

router.get('/', PlantsController.get_all);

router.post('/', PlantsController.post);

router.get('/:id', PlantsController.get_by_id);

router.put('/:id', PlantsController.put);

router.delete('/:id', PlantsController.delete);

export { router };
