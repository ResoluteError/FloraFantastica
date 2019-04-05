import { SerialManager } from "./SerialManager";
import { CONFIG } from "./config";
import express = require("express");
import { Subject } from "rxjs";
import { SerialResponse, SerialMeasurementResponse, SerialCommunicationTypes } from "./models/SerialCommunication.model";
import { QueueItem, QueueItemType, SensorTypes } from "./models/QueueItem.model";
import * as bodyParser from "body-parser";
import * as uuid from "uuid/v1";
import * as request from "request";

export class QueueManager {

  serialManager : SerialManager;
  queueSubscribeable: Subject<QueueItem>;
  responseSubscribeabe: Subject<SerialResponse>;
  queue : QueueItem[];
  app : express.Application;

  constructor(){

    this.serialManager = new SerialManager(
      this.queueSubscribeable,
      this.responseSubscribeabe
    );
    this.setupExpress();

  }


  setupExpress(){

    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended : true}));
    this.listenForHttp();
    this.listenForResponse();
    this.executionLoop();

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

  listenForResponse(){

    this.responseSubscribeabe.subscribe ( response => {

      this.resolveResponse(response);

    });

  }


  resolveResponse( response: SerialResponse): void{
    switch(response.type){

      case SerialCommunicationTypes.Error :
        console.log("Received response type: Error Response");
        break;

      case SerialCommunicationTypes.IsAlive :
        console.log("Received response type: IsAlive Response");
        break;

      case SerialCommunicationTypes.IsBusy :
        console.log("Received response type: IsBusy Response");
        break;

      case SerialCommunicationTypes.Measurement :
        console.log("Received response type: Measurement Response");
        this.resolveMeasurement(<SerialMeasurementResponse>response);
        break;

      default:
        console.log("Unknown response type: " , response);
    }
  }

  async resolveMeasurement( serialResponse : SerialMeasurementResponse){

    var postMeasurement;

    if(serialResponse.queueId){

      var queueIndex : number = 0;

      console.log("Measurement Type: Queue Initiated ");
      if(serialResponse.queueId === this.queue[0].id){

        postMeasurement = {
          sensorId: this.queue[0].sensorId,
          data: serialResponse.data
        };

      } else {
        console.log("[WARNING ]Measurement Response does not match queue!");
        console.log("Queue: ", this.queue);
        console.log("Response: ", serialResponse);  

        queueIndex = this.queue.findIndex( item => item.id === serialResponse.queueId)

        postMeasurement = {
          sensorId: this.queue[queueIndex].sensorId,
          data: serialResponse.data
        };

      }

      this.queue.splice(queueIndex, 1);

    } else {

      console.log("Measurement Type: Arduino Initiated ");
      await request.get(`http://localhost:${CONFIG.WEBSERVER_PORT}/api/sensors/pin/${serialResponse.pin}`, (err : Error, httpResponse, body ) => {

        if(err) {
          console.log("Server Error: Getting sensor for pin: " + serialResponse.pin, err);
          return;
        } 

        if(!body.length){
          console.log("Servser Response Error: No Sensor found for pin ", serialResponse.pin);
          return;
        }

        try {
          var sensor = JSON.parse(body);
          postMeasurement = {
            sensorId: sensor.id,
            data: serialResponse.data
          };

        } catch (err) {

          console.log("Sensor API Response was no valid json: ", body);
          console.log(err);
          return;

        }

      });
    }

    request.post(`http://localhost:${CONFIG.WEBSERVER_PORT}/api/measurements`,{json : postMeasurement}, (err, httpResponse, body) => {
      console.log("Successfully posted measurement to sensor: ", postMeasurement.sensorId);
    });

  }

  executionLoop(){

  }


}