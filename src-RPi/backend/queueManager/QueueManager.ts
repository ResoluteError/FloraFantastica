import { SerialManager } from "./SerialManager";
import { CONFIG } from "./config";
import express = require("express");
import { Subject } from "rxjs";
import { SerialResponse, SerialMeasurementResponse, SerialResponseType, SerialRequestType, SerialErrorResponse, SerialActionResponse } from "./models/SerialCommunication.model";
import { QueueItem, SensorTypes, ActionQueueItem, MeasurementQueueItem, QueueItemOrigin, QueueItemStatus } from "./models/QueueItem.model";
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
        id: req.body.id || uuid(),
        origin: req.body.origin || QueueItemOrigin.Webserver,
        res: res,
        type: req.body.type
      };

      switch(newQueue.type){

        case SerialRequestType.Measurement : 
          var newMeasurementQueueItem : MeasurementQueueItem = {
            ...newQueue,
            sensorId : req.body.sensorId,
            sensorType: req.body.sensorType,
            dataPin: req.body.dataPin,
            powerPin: req.body.powerPin,
          }
          if(Object.values(SensorTypes).includes(newMeasurementQueueItem.sensorType)){
            this.pushToQueue(newMeasurementQueueItem, newMeasurementQueueItem.origin === QueueItemOrigin.Webserver);
          } else {
            console.log(`[QueueManager] ERROR - Sensor type ${newMeasurementQueueItem.sensorType} is not an active sensor`);
            res.status(500).send("Wrong sensor type!");
          }
          break;

        case SerialRequestType.Action : 
          var newActionQueueItem : ActionQueueItem = {
            ...newQueue,
            actionType : req.body.actionType,
            actionPin : req.body.actionPin,
            activationType: req.body.activationType,
            duration : req.body.duration
          }
          this.pushToQueue(newActionQueueItem, newActionQueueItem.origin === QueueItemOrigin.Webserver);
          break;
      }

      console.log("[QueueManager] STATUS - Added to queue");

    
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

      case SerialResponseType.Error :
        console.log("[QueueManager] STATUS - Received response type: Error Response");
        this.resolveError(<SerialErrorResponse>response);
        break;

      case SerialResponseType.IsAlive :
        console.log("[QueueManager] STATUS - Received response type: IsAlive Response");
        console.log(response);
        break;

      case SerialResponseType.IsBusy :
        console.log("[QueueManager]  TATUS - Received response type: IsBusy Response");
        console.log(response);
        break;

      case SerialResponseType.Confirmation :
        console.log("[QueueManager] STATUS - Received response type: Confirmation Response");
        this.resolveConfirmation(response);
        break;

      case SerialResponseType.Measurement :
        console.log("[QueueManager] STATUS - Received response type: Measurement Response");
        this.resolveMeasurement(<SerialMeasurementResponse>response);
        break;

      case SerialResponseType.Action :
        console.log("[QueueManager] STATUS - Received response type: Measurement Response");
        this.resolveAction(<SerialActionResponse>response);
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
        console.log("[QueueManager] Response: ", response);
      }

    }

  }

  resolveAction( serialResponse : SerialActionResponse){

    console.log("[QueueManager] STATUS - Action Type: Queue Initiated ");

    if(serialResponse.queueId === this.queue[0].id){

      var completedAction = this.queue.splice(0,1)[0];
      completedAction.res.status(200).send({success:true});

    } else {

      console.log("[QueueManager] WARNING - Actions Response does not match queue!");
      
      var queueIndex = this.queue.findIndex( item => item.id === serialResponse.queueId);

      if(queueIndex > -1){

        var queueItem = <ActionQueueItem>this.queue.splice(queueIndex, 1)[0];
        completedAction.res.status(200).send({success:true});

      } else {

        console.log("[QueueManager] WARNING - No Queue item found for measurement!");
        console.log("[QueueManager] Measurement: ", serialResponse);

      }
    }

    this.queueListener.next(this.queue);

  }

  async resolveMeasurement( serialResponse : SerialMeasurementResponse){

    var postMeasurement;

    if(serialResponse.queueId){

      var queueIndex : number = 0;

      console.log("[QueueManager] STATUS - Measurement Type: Queue Initiated ");
      if(serialResponse.queueId === this.queue[0].id){

        var queueItem = <MeasurementQueueItem>this.queue[0];
        queueItem.value = serialResponse.data;

      } else {
        console.log("[QueueManager] WARNING - Measurement Response does not match queue!");

        queueIndex = this.queue.findIndex( item => item.id === serialResponse.queueId);

        if(queueIndex > -1){

          var queueItem = <MeasurementQueueItem>this.queue[queueIndex];
          queueItem.value = serialResponse.data;

        } else {

          console.log("[QueueManager] WARNING - No Queue item found for measurement!");
          console.log("[QueueManager] Measurement: ", serialResponse);

        }

      }

    } else {

      console.log("[QueueManager] STATUS - Measurement Type: Arduino Initiated ");
      await request.get(`http://localhost:${CONFIG.WEBSERVER_PORT}/api/sensors/pin/${serialResponse.dataPin}`, (err : Error, httpResponse, body ) => {

        if(err) {
          console.log("[QueueManager] SERVER ERROR - Getting sensor for pin: " + serialResponse.dataPin, err);
          return;
        } 

        if(!body.length){
          console.log("[QueueManager] HTTP RESPONSE ERROR - No Sensor found for pin ", serialResponse.dataPin);
          return;
        }

        try {
          var sensor = JSON.parse(body);
          postMeasurement = {
            sensorId: sensor.id,
            data: serialResponse.data
          };

          request.post(`http://localhost:${CONFIG.WEBSERVER_PORT}/api/measurements`,{json : postMeasurement}, (err, httpResponse, body) => {

            if(err){
              console.log("[QueueManager] ERROR - Failed posting arduino initiated measurement!");
              console.log("[QueueManager] ", err);
              return;
            }

            console.log("[QueueManager] STATUS - Successfully posted measurement to sensor: ", postMeasurement.sensorId);
          });

        } catch (err) {

          console.log("[QueueManager] ERROR - Sensor API Response was no valid json: ", body);
          console.log(err);
          return;

        }

      });
    }

    this.queueListener.next(this.queue);

  }

  resolveError( response : SerialErrorResponse){

    var queueIndex = this.queue.findIndex( item => item.id === response.queueId);
    if(queueIndex > -1){

      var item = this.queue.splice(queueIndex, 1);
      item[0].res.status(404).send(new Error("Sensor Measurement resulted in Error"));
      this.queueListener.next(this.queue);

    } else {

      console.log("[QueueManager] WARNING - Serial error not queue item related!");
      console.log("[QueueManager] Serial Response: ", response);

    }

  }


  retryAtPortError(){
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

  }

  getQueueItemStatus( queueItem : QueueItem) : QueueItemStatus{

    var confirmedTimeOutThreshold = 1000 * 15;

    switch(queueItem.type){
      case SerialRequestType.Action :
        var actionItem : ActionQueueItem = <ActionQueueItem> queueItem;
        
        if(actionItem.duration){
          confirmedTimeOutThreshold += actionItem.duration;
        }

        break;
      case SerialRequestType.Measurement :
        var measurementItem : MeasurementQueueItem = <MeasurementQueueItem> queueItem;

        if(typeof measurementItem.value === "number"){
          return QueueItemStatus.Completed;
        }

        break;
    }

    if( queueItem.confirmed < Date.now() - confirmedTimeOutThreshold){
      return QueueItemStatus.ConfirmedTimeOut;
    }

    if( queueItem.confirmed){
      return QueueItemStatus.Confirmed;
    }

    if( queueItem.submitted < Date.now() - 1000 * 15){
      return QueueItemStatus.SubmittedTimeOut;
    }

    if( queueItem.submitted){
      return QueueItemStatus.Submitted;
    }

    if( queueItem.id){
      return QueueItemStatus.ReadyForSubmit;
    }

    return QueueItemStatus.Unknown;

  }

  executionLoop(){


    // Fallback to re-check the status every 30 seconds
    setInterval( () => {
      this.queueListener.next(this.queue);
    }, 1000 * 30);


    this.queueListener.subscribe( (changedQueue : QueueItem[]) => {

      if(!this.serialManager.getPortStatus){
        this.retryAtPortError();
      } else {
        this.portErrCounter = 0;
      }
      
      if(changedQueue.length > 0){

        var firstQueueItem = changedQueue[0]
        var status = this.getQueueItemStatus(firstQueueItem)

        switch(status){

          case QueueItemStatus.Completed:
            console.log("[QueueManager] STATUS - Removing completed Item from Que");
            if(firstQueueItem.type == SerialRequestType.Measurement){
              var removedItem = <MeasurementQueueItem> this.queue.splice(0, 1)[0];
              removedItem.res.status(200).send({data:removedItem.value});
              this.queueListener.next(this.queue);
              return;
            }
            break;

          case QueueItemStatus.ConfirmedTimeOut,
          QueueItemStatus.SubmittedTimeOut:

            console.log("[QueueManager] WARNING - Removing timeout item from Que.");
            var item = this.queue.splice(0, 1)[0];
            item.res.status(408).send(new Error("Sensor measurement timed out!"));
            this.queueListener.next(this.queue);

            break;

          case QueueItemStatus.Confirmed, 
            QueueItemStatus.Submitted:
            break;

          case QueueItemStatus.ReadyForSubmit:
          
            switch(firstQueueItem.type){
              case SerialRequestType.Action:
                console.log("[QueueManager] STATUS - Requesting new action");
                this.serialManager.requestActionSerial(firstQueueItem);
                break;

              case SerialRequestType.Measurement:
                console.log("[QueueManager] STATUS - Requesting new measurement");
                this.serialManager.requestMeasurementSerial(firstQueueItem);
                break;

            }

            break;

          case QueueItemStatus.Unknown:
            console.log("[QueueManager] WARNING - Removing unknown queue item.");
            console.log(firstQueueItem);
            this.queue.splice(0,1);
            this.queueListener.next(this.queue);
            break;

        }
      }
    });
  }

}