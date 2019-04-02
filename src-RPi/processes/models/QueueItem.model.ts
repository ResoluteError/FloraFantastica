export class QueueItem {
  
  id: string;
  isSubmitted : boolean;

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