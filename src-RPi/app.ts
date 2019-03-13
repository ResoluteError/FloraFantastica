import "reflect-metadata";
import express = require("express");
import {router as plantsRouter} from "./routes/PlantsRouter";
import {router as sensorMeasurementsRouter} from "./routes/SensorMeasurementsRouter";
import {router as sensorsRouter} from "./routes/SensorsRouter";
import { createConnection } from "typeorm";

createConnection().then(async connection => {

  const app : express.Application = express();
  
  app.use("/api/plants/:plantId/sensor-measurements",sensorMeasurementsRouter);
  app.use("/api/plants/:plantId/sensors/",sensorsRouter);
  app.use("/api/plants",plantsRouter);
  
  app.use(express.static("FaunaFantasticaFrontend/dist/FaunaFantasticaFrontend"));
  
  app.listen(8080, () => {
    console.log("Listening");
  });

});
