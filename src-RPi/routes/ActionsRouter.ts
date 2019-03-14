import express = require("express");
import { ActionsController } from "../controller/ActionsController";

const router : express.Router = express.Router();

router.post("/plant/:plantId/update-current-data", ActionsController.updatePlantCurrentData)

export {router};