import "reflect-metadata";
import express = require("express");
import {router as plantsRouter} from "./routes/PlantsRouter";
import {router as sensorMeasurementsRouter} from "./routes/MeasurementsRouter";
import {router as sensorsRouter} from "./routes/SensorsRouter";
import {router as seedRouter} from "./routes/SeedRouter";
import {router as actionsRouter} from "./routes/ActionsRouter";
import { createConnection } from "typeorm";
import bodyParser = require('body-parser')

createConnection().then(async connection => {

  await connection.synchronize();

  const app : express.Application = express();
  
  app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();

  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.use("/api/measurements/",sensorMeasurementsRouter);
  app.use("/api/sensors/",sensorsRouter);
  app.use("/api/plants/",plantsRouter);
  app.use("/api/actions/",actionsRouter);
  app.use("/seed/",seedRouter);
  
  app.use("/uploads", express.static(__dirname + "/public/uploads"));
  app.use(express.static(__dirname + "/public/frontend-dist"));
  
  app.listen(8080, () => {
    console.log("Listening");
  });

});
