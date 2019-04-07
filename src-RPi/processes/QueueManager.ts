import { SerialManager } from "./SerialManager";
import { CONFIG } from "./config";
import express = require("express");
import { Subject } from "rxjs";
import { SerialResponse, SerialMeasurementResponse, SerialCommunicationTypes, SerialErrorResponse } from "./models/SerialCommunication.model";
import { QueueItem, QueueItemType, SensorTypes } from "./models/QueueItem.model";
import * as bodyParser from "body-parser";
import * as uuid from "uuid/v1";
import * as request from "request";

export class QueueManager {

  serialManager : SerialManager;
  responseSubscribeable: Subject<SerialResponse>;
  queue : QueueItem[];
  queueListener : Subject<QueueItem[]>;
  app : express.Application;
  portErrCounter : number = 0;

  constructor(){

    this.responseSubscribeable = new Subject();
    this.queueListener = new Subject();
    this.queue = [];

    this.serialManager = new SerialManager(
      this.responseSubscribeable
    );
    this.setupExpress();
    this.listenForHttp();
    this.listenForResponse();
    this.executionLoop();

  }


  setupExpress(){

    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended : true}));

  }

  listenForHttp() : void{

    this.app.post("/queue", (req: express.Request, res: express.Response) => {

      var newQueue : QueueItem = {
        id: uuid(),
        type: req.body.type || QueueItemType.Webserver,
        sensorId : req.body.sensorId,
        sensorType: req.body.sensorType,
        pin: req.body.pin,
        res: res
      };

      console.log("[QueueManager] STATUS - Added to queue");

      if(Object.values(SensorTypes).includes(newQueue.sensorType)){
        this.pushToQueue(newQueue, newQueue.type === QueueItemType.Webserver);
      } else {
        console.log(`[QueueManager] ERROR - Sensor type ${newQueue.sensorType} is not an active sensor`);
        res.status(500).error("Wrong sensor type!");
      }

    
    });

    this.app.listen(CONFIG.QUEUE_MANAGER_PORT, ()=>{
      console.log("[QueueManager] STATUS - Listening on port: " + CONFIG.QUEUE_MANAGER_PORT);
    });
  }


  pushToQueue(queueItem : QueueItem, prioritize?: boolean): void{
    if(prioritize){
      if(this.queue.length > 0 && this.queue[0].submitted){
        this.queue = [this.queue[0], queueItem].concat(this.queue.slice(1));
      } else {
        this.queue = [queueItem].concat(this.queue.slice());
      }
    } else {
      this.queue.push(queueItem)
    }
    this.queueListener.next(this.queue);
  }


  listenForResponse(){

    this.responseSubscribeable.subscribe ( response => {

      this.resolveResponse(response);

    });

  }


  resolveResponse( response: SerialResponse): void{
    switch(response.type){

      case SerialCommunicationTypes.Error :
        console.log("[QueueManager] STATUS - Received response type: Error Response");
        this.resolveError(<SerialErrorResponse>response);
        break;

      case SerialCommunicationTypes.IsAlive :
        console.log("[QueueManager] STATUS - Received response type: IsAlive Response");
        console.log(response);
        break;

      case SerialCommunicationTypes.IsBusy :
        console.log("[QueueManager]  TATUS - Received response type: IsBusy Response");
        console.log(response);
        break;

      case SerialCommunicationTypes.Confirmation :
        console.log("[QueueManager] STATUS - Received response type: Confirmation Response");
        this.resolveConfirmation(response);
        break;

      case SerialCommunicationTypes.Measurement :
        console.log("[QueueManager] STATUS - Received response type: Measurement Response");
        this.resolveMeasurement(<SerialMeasurementResponse>response);
        break;

      default:
        console.log("[QueueManager] WARNING - Unknown response type: " , response);
    }
  }

  resolveConfirmation( response : SerialResponse){

    console.log(`[QueueManager] STATUS - Queue item ${response.queueId} request was confirmed`);

    if(response.queueId === this.queue[0].id){

      this.queue[0].confirmed = Date.now();
      this.queueListener.next(this.queue);

    } else {

      var index = this.queue.findIndex( item => item.id === response.queueId);
      if(index > -1){
        console.log(`[QueueManager] WARNING - Confirmation for index ${index} insteaf of 0`);
        this.queue[index].confirmed = Date.now();
        this.queueListener.next(this.queue);
      } else {
        console.log(`[QueueManager] WARNING - Confirmed item is not part of queue!`);
        console.log("[QueueManager] Queue: ", this.queue, ", Response: ", response);
      }

    }

  }

  async resolveMeasurement( serialResponse : SerialMeasurementResponse){

    var postMeasurement;

    if(serialResponse.queueId){

      var queueIndex : number = 0;

      console.log("[QueueManager] STATUS - Measurement Type: Queue Initiated ");
      if(serialResponse.queueId === this.queue[0].id){

        postMeasurement = {
          sensorId: this.queue[0].sensorId,
          data: serialResponse.data
        };

        this.queue[0].value = serialResponse.data;

      } else {
        console.log("[QueueManager] WARNING - Measurement Response does not match queue!");

        queueIndex = this.queue.findIndex( item => item.id === serialResponse.queueId);

        if(queueIndex > -1){

          postMeasurement = {
            sensorId: this.queue[queueIndex].sensorId,
            data: serialResponse.data
          };
  
          this.queue[queueIndex].value = serialResponse.data;

        } else {

          console.log("[QueueManager] WARNING - No Queue item found for measurement!");
          console.log("[QueueManager] Queue: ", this.queue, ", Measurement: ", serialResponse);

        }

      }

    } else {

      console.log("[QueueManager] STATUS - Measurement Type: Arduino Initiated ");
      await request.get(`http://localhost:${CONFIG.WEBSERVER_PORT}/api/sensors/pin/${serialResponse.pin}`, (err : Error, httpResponse, body ) => {

        if(err) {
          console.log("[QueueManager] SERVER ERROR - Getting sensor for pin: " + serialResponse.pin, err);
          return;
        } 

        if(!body.length){
          console.log("[QueueManager] HTTP RESPONSE ERROR - No Sensor found for pin ", serialResponse.pin);
          return;
        }

        try {
          var sensor = JSON.parse(body);
          postMeasurement = {
            sensorId: sensor.id,
            data: serialResponse.data
          };

        } catch (err) {

          console.log("[QueueManager] ERROR - Sensor API Response was no valid json: ", body);
          console.log(err);
          return;

        }

      });
    }

    request.post(`http://localhost:${CONFIG.WEBSERVER_PORT}/api/measurements`,{json : postMeasurement}, (err, httpResponse, body) => {
      console.log("[QueueManager] STATUS - Successfully posted measurement to sensor: ", postMeasurement.sensorId);
    });

    this.queueListener.next(this.queue);

  }

  resolveError( response : SerialErrorResponse){

    var queueIndex = this.queue.findIndex( item => item.id === response.queueId);
    if(queueIndex > -1){

      var sensorId = this.queue[queueIndex].sensorId;

      this.deactivateSensor(sensorId);

      var item = this.queue.splice(queueIndex, 1);
      item[0].res.status(404).send(new Error("Sensor Measurement resulted in Error"));
      this.queueListener.next(this.queue);

    } else {

      console.log("[QueueManager] WARNING - Serial error not queue item related!");
      console.log("[QueueManager] Serial Response: ", response, ", Queue: ", this.queue);

    }

  }

  deactivateSensor( sensorId : string){

    console.log("[QueueManager] STATUS - Deactivating Sensor " + sensorId);

    request.patch(`http://localhost:${CONFIG.WEBSERVER_PORT}/api/sensors/${sensorId}`, {json : {
      state : 0
    }}, (err, response, body) => {
      
      if(err){
        console.log("[QueueManager] SERVER ERROR - Failed patching sensor!");
        console.log("[QueueManager] Serial Response: ", response, ", Error: ", err);
      }

    });

  }

  executionLoop(){


    // Fallback to re-check the status every 10 minutes
    // Technically there should be no szenario, where this is actually needed
    // But you never know...
    setInterval( () => {
      this.queueListener.next(this.queue);
    }, 1000 * 60 * 60 * 10);


    this.queueListener.subscribe( (changedQueue : QueueItem[]) => {

      if(!this.serialManager.getPortStatus){
        this.portErrCounter++;
        console.log("[QueueManager] ERROR - Failed reaching Port");
        if(this.portErrCounter < 10){

          setTimeout( () => {
            this.queueListener.next(
              this.queue
            );
          }, 500);
          return;

        } else {

          console.log("[QueueManager] KILLING PROCESS - PortErrCounter Exceeded Limit");
          return process.exit();

        }

      } else {

        this.portErrCounter = 0;

      }
      
      if(changedQueue.length > 0){

        if(changedQueue[0].submitted){

          if(changedQueue[0].confirmed){

            if(changedQueue[0].value){

              // Got all required data
              console.log("[QueueManager] STATUS - Removing completed Item from Que");
              var item = this.queue.splice(0, 1);
              item[0].res.status(200).send({data:item[0].value});
              this.queueListener.next(this.queue);
              return;

            }

            if(changedQueue[0].confirmed && changedQueue[0].confirmed < Date.now() - 15*1000){

              // Measurement Timed Out
              console.log("[QueueManager] WARNING - Removing measurement-timeout Item from Que. Sensor ID: ", this.queue[0].sensorId);
              this.deactivateSensor( this.queue[0].sensorId);

              var item = this.queue.splice(0, 1);
              item[0].res.send(new Error("Sensor measurement timed out!"));

              this.queueListener.next(this.queue);
              return;

            }

            return;

          }

          if(changedQueue[0].submitted && changedQueue[0].submitted < Date.now() - 15*1000){

            // Measurement Timed Out
            console.log("[QueueManager] WARNING - Removing confirmation-timeout Item from Que. Sensor ID: ", this.queue[0].sensorId);
            this.deactivateSensor( this.queue[0].sensorId);
            var item = this.queue.splice(0, 1);
            item[0].res.send(new Error("Sensor confirmation timed out!"));
            this.queueListener.next(this.queue);
            return;

          }

          return;

        }
        
        console.log("[QueueManager] STATUS - Requesting new measurement of type ", this.queue[0].sensorType);
        this.serialManager.requestMeasurementSerial(this.queue[0]);
        this.queue[0].submitted = Date.now();
        this.queueListener.next(this.queue);

      }

    });

  }


}