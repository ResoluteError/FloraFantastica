import "reflect-metadata";
import express = require("express");
import {router as plantsRouter} from "./routes/PlantsRouter";
import {router as sensorMeasurementsRouter} from "./routes/MeasurementsRouter";
import {router as sensorsRouter} from "./routes/SensorsRouter";
import {router as seedRouter} from "./routes/SeedRouter";
import {router as actionsRouter} from "./routes/ActionsRouter";
import { createConnection } from "typeorm";
import bodyParser = require('body-parser')
import {CONFIG} from './config'


console.log(`Path to uploads: ${CONFIG.UPLOADS_DIR}`);
console.log(`Serving frontend from: ${CONFIG.FRONTEND_DIR}`);
console.log(`TYPE_ORM Constants `)
console.log(`TYPEORM_CONNECTION: ${process.env.TYPEORM_CONNECTION}`)
console.log(`TYPEORM_DATABASE: ${process.env.TYPEORM_DATABASE}`)
console.log(`TYPEORM_ENTITIES: ${process.env.TYPEORM_ENTITIES}`)

createConnection().then(async connection => {

  // Uses environment variables by default, ormconfig.json is fallback
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
  
  app.use("/uploads", express.static(CONFIG.UPLOADS_DIR));
  app.use(express.static(CONFIG.FRONTEND_DIR));
  
  app.listen(CONFIG.NODE_PORT, () => {

    console.log(`Started FloraFantastica Server, listening on Port: ${CONFIG.NODE_PORT}`);

  });

});
