export class SerialCommunicationBase {

  type : SerialCommunicationTypes;

}

export class SerialRequest extends SerialCommunicationBase{
  queueId: string;
}

export class SerialResponse extends SerialCommunicationBase {
  queueId?: string;
}

export class SerialMeasurementRequest extends SerialRequest {

  pin: number;
  sensorType: number;

}

export enum SerialCommunicationTypes {

  Error = "error",
  IsAlive = "isAlive",
  IsBusy = "isBusy",
  Measurement = "measurement",
  Confirmation = "confirmation"

}

export class SerialErrorResponse extends SerialResponse{

  message : string;
  code?: number;

}

export enum SerialErrorCode {

  JSON_REQUEST_PARSING = 400,
  SENSOR_NOT_FOUND = 404,
  SENSOR_ERROR = 500,
  INVALID_SERIAL_RESPONSE = 502

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