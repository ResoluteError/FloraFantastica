import { QueueItem, QueueItemType, SensorTypes } from "./models/QueueItem.model";
import express = require("express");
import { CONFIG } from "./config";
import * as SerialPort from "serialport";
import * as bodyParser from "body-parser";
import * as uuid from "uuid/v1";
import { SerialResponse, SerialResponseTypes, SerialMeasurementResponse } from "./models/SerialResponse.model";
import { Subject } from "rxjs"
import * as request from "request";

/*

  This process keeps the serial connection open 
  and manages the communication with the arduino.

  Case 1: Arduino emits Event

  Case 2: CRON Job requests Arduino Measurement 

  Case 3: Webserver (upon user request) requests Arduino Measurement

*/


export class SerialManager{


  requestQueue : QueueItem[];
  app : express.Application;
  parser : SerialPort.parsers.Readline;
  queueSubscribeable : Subject<QueueItem>;


  constructor(){
    
    this.setupExpress();
    this.setupSerial();
    this.listenForSerial();

  }

  setupExpress(){

    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended : true}));

  }

  setupSerial(){

    var serialPort = new SerialPort(CONFIG.ARDUINO_PORT, {
      baudRate: CONFIG.ARDUINO_BAUD_RATE
    });

    var readline = new SerialPort.parsers.Readline({ delimiter : '\r\n'});
    this.parser = serialPort.pipe(readline);
  }

  listenForSerial(){

    this.parser.on( 'data', data => {
      
      this.resolveResponse(data);
      
    });

  }

  listenForHttp() : void{

    this.app.post("/queue", (req: express.Request, res: express.Response) => {

      var newQueue : QueueItem = {
        id: uuid(),
        type: req.body.type || QueueItemType.Webserver,
        sensorId : req.body.sensorId,
        sensorType: req.body.sensorType,
        pin: req.body.pin
      };

      if(Object.values(SensorTypes).includes(newQueue.sensorType)){
        this.pushToQueue(newQueue);
      } else {
        console.log(`[Serial Manager] Error - Sensor type ${newQueue.sensorType} is not an active sensor`);
      }

    
    });

    this.app.listen(CONFIG.SERIAL_MANAGER_PORT, ()=>{
      console.log("[Serial Manager] Listening on port: " + CONFIG.SERIAL_MANAGER_PORT);
    });
  }

  pushToQueue(queueItem : QueueItem): void{

  }

  resolveResponse( response: string): void{
    try {
      var responseObj : SerialResponse = JSON.parse(response);

      switch(responseObj.type){

        case SerialResponseTypes.Error :
          console.log("Received response type: Error Response");
          break;

        case SerialResponseTypes.IsAlive :
          console.log("Received response type: IsAlive Response");
          break;

        case SerialResponseTypes.IsBusy :
          console.log("Received response type: IsBusy Response");
          break;

        case SerialResponseTypes.Measurement :
          console.log("Received response type: Measurement Response");
          this.resolveMeasurement(<SerialMeasurementResponse>responseObj);
          break;

        default:
          console.log("Unknown response type: " , responseObj);
      }

    } catch (err) {

      console.log("Unspecified Serial String: ", response);

    }
  }

  resolveMeasurement( serialResponse : SerialMeasurementResponse): void{

    if(serialResponse.queueId){

      console.log("Measurement Type: Queue Initiated ");
      // Was requested from queue
      // Send to Server
      // Drop Queue Item
      // Start next Queue item if any 

    } else {

      console.log("Measurement Type: Arduino Initiated ");
      request.get(`http://localhost:${CONFIG.WEBSERVER_PORT}/api/sensors/pin/${serialResponse.pin}`, (err : Error, httpResponse, body ) => {

        if(err) {
          console.log("Error getting sensor for pin: " + serialResponse.pin, err);
        } 

        if(!body.length){
          console.log("WARNING: No Sensor found for pin ", serialResponse.pin);
        }

        try {
          var sensor = JSON.parse(body);
          var measurement = {
            sensorId: sensor.id,
            data: serialResponse.data
          };

          request.post(`http://localhost:${CONFIG.WEBSERVER_PORT}/api/measurements`,{json : measurement}, (err, httpResponse, body) => {
            console.log("Successfully posted measurement to sensor: ", sensor.name);
          });

        } catch (err) {

          console.log("Sensor API Response was no valid json: ", body);
          console.log(err);

        }

      });

    }

  }

}
