
import express = require("express");
import { SerialRequestType, SerialActionType, SerialActionActivationType } from "./SerialCommunication.model";


export class QueueItem {
  
  id: string;
  origin: QueueItemOrigin;
  res: express.Response;
  submitted? : number;
  confirmed? : number;
  type: SerialRequestType

}

export class MeasurementQueueItem extends QueueItem {

  type = SerialRequestType.Measurement;
  sensorId : string;
  sensorType : SensorTypes;
  dataPin: number;
  powerPin: number;
  value?: number;

}

export class ActionQueueItem extends QueueItem{

  type = SerialRequestType.Action;
  actionType : SerialActionType;
  actionPin : number;
  activationType: SerialActionActivationType;
  duration? : number;

}

export enum QueueItemOrigin {

  Self="self",
  Cron="cron",
  Webserver="webserver"

}

// Passive Sensors (e.g. Watering Button) and 
// Virtual Sensors (e.g. Plant Health) are ignored
export enum SensorTypes {

  AIR_TEMP = 10,
  AIR_HUMID = 11,
  SOIL_MOIST = 20,
  SOIL_TEMP = 21,
  LIGHT_INT = 30

}

export enum QueueItemStatus {

  Completed = 0,
  ConfirmedTimeOut,
  Confirmed,
  SubmittedTimeOut,
  Submitted,
  ReadyForSubmit,
  Unknown


}