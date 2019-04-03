export class QueueItem {
  
  id: string;
  submitted? : number;

  type: QueueItemType;

  sensorId : string;
  sensorType : SensorTypes;
  pin: string;
  value?: number;

}

export enum QueueItemType {

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