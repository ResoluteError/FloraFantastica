export class SerialResponse {

  type : SerialResponseTypes;
  
  queueId?: string;

}

export enum SerialResponseTypes {

  Error = "error",
  IsAlive = "isAlive",
  IsBusy = "isBusy",
  Measurement = "measurement"

}

export class SerialErrorResponse extends SerialResponse{

  message : string;
  code?: number;

}

export enum SerialErrorCode {

  JSON_REQUEST_PARSING = 400,
  SENSOR_NOT_FOUND = 404,
  SENSOR_ERROR = 500

}

export class SerialIsAliveResponse extends SerialResponse{

  alive: boolean;

}

export class SerialIsBusyResponse extends SerialResponse{

  busy: boolean;

}

export class SerialMeasurementResponse extends SerialResponse{

  data: number;
  pin: number;

}