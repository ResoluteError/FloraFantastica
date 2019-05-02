"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var SchedulesController_1 = require("../controller/SchedulesController");
var router = express.Router();
exports.router = router;
router.get("/", SchedulesController_1.SchedulesController.getAll);
router.get("/active", SchedulesController_1.SchedulesController.getActive);
router.get("/:scheduleId", SchedulesController_1.SchedulesController.getById);
router.post("/", SchedulesController_1.SchedulesController.post);
router.patch("/:scheduleId", SchedulesController_1.SchedulesController.patch);
router.delete("/:scheduleId", SchedulesController_1.SchedulesController.delete);
router.get("/plant/:plantId", SchedulesController_1.SchedulesController.getByPlantId);
//# sourceMappingURL=SchedulesRouter.js.map