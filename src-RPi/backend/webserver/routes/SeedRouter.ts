import express = require("express");
import { SeedDataController } from "../controller/SeedDataController";

const router : express.Router = express.Router();

router.get("/seed/plants", SeedDataController.seedPlants);
router.get("/seed/sensors", SeedDataController.seedSensors);
router.get("/seed/measurements", SeedDataController.seedMeasurements);
router.get("/seed/view", SeedDataController.viewData);
router.get("/seed/drop", SeedDataController.dropSeed);

export {router};