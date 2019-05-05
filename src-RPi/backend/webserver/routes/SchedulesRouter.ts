import express = require("express");
import { SchedulesController } from "../controller/SchedulesController";
import { Authorizer } from "../auth/authorizer";

const router : express.Router = express.Router();

router.get("/", SchedulesController.getAll);

router.get("/active", SchedulesController.getActive);

router.get("/:scheduleId", SchedulesController.getById);

router.post("/", Authorizer.IsSimpleAuthorized, SchedulesController.post);

router.patch("/:scheduleId", Authorizer.IsSimpleAuthorized, SchedulesController.patch);

router.delete("/:scheduleId", Authorizer.IsSimpleAuthorized, SchedulesController.delete);

router.get("/plant/:plantId", SchedulesController.getByPlantId);

export {router};