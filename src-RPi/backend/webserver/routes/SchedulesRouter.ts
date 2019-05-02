import express = require("express");
import { SchedulesController } from "../controller/SchedulesController";

const router : express.Router = express.Router();

router.get("/", SchedulesController.getAll);

router.get("/active", SchedulesController.getActive);

router.get("/:scheduleId", SchedulesController.getById);

router.post("/", SchedulesController.post);

router.patch("/:scheduleId", SchedulesController.patch);

router.delete("/:scheduleId", SchedulesController.delete);

router.get("/plant/:plantId", SchedulesController.getByPlantId);

export {router};