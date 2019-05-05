import "reflect-metadata";
import express = require("express");
import {router as plantsRouter} from "./routes/PlantsRouter";
import {router as sensorMeasurementsRouter} from "./routes/MeasurementsRouter";
import {router as sensorsRouter} from "./routes/SensorsRouter";
import {router as seedRouter} from "./routes/SeedRouter";
import {router as actionsRouter} from "./routes/ActionsRouter";
import {router as scheduleRouter} from "./routes/SchedulesRouter";
import { createConnection } from "typeorm";
import bodyParser = require('body-parser');
import {CONFIG} from './config';
import * as http from 'http';
import  * as https from 'https';
import  * as fs from 'fs';

console.log("======= ENVIRONMENT DEBUG ======");
console.log(`PROD_MODE: ${CONFIG.PROD_MODE}`);
console.log(`Path to uploads: ${CONFIG.UPLOADS_DIR}`);
console.log(`Serving public from: ${CONFIG.PUBLIC_DIR}`);
console.log(`Serving frontend from: ${CONFIG.FRONTEND_DIR}`);
console.log(`TYPE_ORM Constants `);
console.log(`TYPEORM_CONNECTION: ${process.env.TYPEORM_CONNECTION}`);
console.log(`TYPEORM_DATABASE: ${process.env.TYPEORM_DATABASE}`);
console.log(`TYPEORM_ENTITIES: ${process.env.TYPEORM_ENTITIES}`);
console.log("===================")

createConnection().then(async connection => {

  // Uses environment variables by default, ormconfig.json is fallback
  await connection.synchronize(false);

  const app : express.Application = express();
  
  app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();

  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // app.use( (req, res, next) => {
  //   console.log("Got Request: ", req.url);
  //   next();
  // });


  app.use("/api/measurements/",sensorMeasurementsRouter);
  app.use("/api/sensors/",sensorsRouter);
  app.use("/api/plants/",plantsRouter);
  app.use("/api/actions/",actionsRouter);
  app.use("/api/schedules/",scheduleRouter);
  app.use("/seed/",seedRouter);
  
  app.use("/uploads", express.static(CONFIG.UPLOADS_DIR));

  app.use(express.static(CONFIG.FRONTEND_DIR));

  app.get('*', (req, res) => {
    res.sendFile(CONFIG.FRONTEND_DIR + "/index.html");
  })
  

  if(CONFIG.PROD_MODE){

    // Certificate
    const privateKey = fs.readFileSync(__dirname + '/keys/privkey.pem', 'utf8');
    const certificate = fs.readFileSync(__dirname + '/keys/cert.pem', 'utf8');
    const ca = fs.readFileSync(__dirname + '/keys/chain.pem', 'utf8');

    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
    };

    const httpServer = http.createServer(app);
    const httpsServer = https.createServer(credentials, app);

    httpServer.listen(CONFIG.WEBSERVER_PORT, () => {
      console.log('HTTP Server running on port 80');
    });
    
    httpsServer.listen(CONFIG.WEBSERVER_HTTPS_PORT, () => {
      console.log('HTTPS Server running on port 443');
    });

  } else {

    app.listen(CONFIG.WEBSERVER_PORT, () => {

      console.log(`Started FloraFantastica HTTP Server, listening on Port: ${CONFIG.WEBSERVER_PORT}`);
  
    });
    
    app.listen(CONFIG.WEBSERVER_HTTPS_PORT, () => {
  
      console.log(`Started FloraFantastica HTTPS Server, listening on Port: ${CONFIG.WEBSERVER_HTTPS_PORT}`);
  
    });
  }




});
