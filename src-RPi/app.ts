import "reflect-metadata";
import express = require("express");
import {router as plantsRouter} from "./routes/PlantsRouter";
import {router as sensorMeasurementsRouter} from "./routes/SensorMeasurementsRouter";
import {router as sensorsRouter} from "./routes/SensorsRouter";
import { createConnection } from "typeorm";
import { SeedDataController } from "./controller/SeedDataController";
import bodyParser = require('body-parser')

createConnection().then(async connection => {

  await connection.synchronize();

  const app : express.Application = express();
  
  app.use(bodyParser.json());

  app.use("/api/plants/sensor-measurements/",sensorMeasurementsRouter);
  app.use("/api/plants/sensors/",sensorsRouter);
  app.use("/api/plants",plantsRouter);

  app.get("/seed/plants", SeedDataController.seedPlants);
  app.get("/seed/view", SeedDataController.viewData);
  app.get("/seed/drop", SeedDataController.dropSeed);
  
  app.use(express.static("FaunaFantasticaFrontend/dist/FaunaFantasticaFrontend"));
  
  app.listen(8080, () => {
    console.log("Listening");
  });

});
