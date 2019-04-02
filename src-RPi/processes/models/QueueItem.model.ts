export class QueueItem {
  
  id: string;
  submitted? : number;

  type: QueueItemType

  sensorId : string;
  pin: string;
  value?: number;

}

export enum QueueItemType {

  Self="self",
  Cron="cron",
  Webserver="webserver"

}