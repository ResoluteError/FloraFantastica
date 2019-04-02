import { QueueItem, QueueItemType } from "./models/QueueItem.model";
import express = require("express");
import { CONFIG } from "./config";
import * as SerialPort from "serialport";
import * as bodyParser from "body-parser";
import * as uuid from "uuid/v1";
import { SerialResponse, SerialResponseTypes } from "./models/SerialResponse.model";
import { Subject } from "rxjs"

/*

  This process keeps the serial connection open 
  and manages the communication with the arduino.

  Case 1: Arduino emits Event

  Case 2: CRON Job requests Arduino Measurement 

  Case 3: Webserver (upon user request) requests Arduino Measurement

*/


class SerialManager{


  requestQueue : QueueItem[];
  app : express.Application;
  parser : SerialPort.parsers.Readline;
  queueSubscribeable : Subject<QueueItem>;


  constructor(){
    
    this.setupExpress();
    this.setupSerial();

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
        pin: req.body.pin
      };

      this.pushToQueue(newQueue);
    
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
          break;

        case SerialResponseTypes.IsAlive :
          break;

        case SerialResponseTypes.IsBusy :
          break;

        case SerialResponseTypes.Measurement :
          break;

        default:
          console.log("Unknown response type: " , responseObj);
      }

    } catch (err) {

      console.log("Unspecified Serial String: ", response);

    }
  }

}
