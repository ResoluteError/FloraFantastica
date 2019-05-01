export class SerialCommunicationBase {

  type : SerialResponseType | SerialRequestType;

}

export class SerialRequest extends SerialCommunicationBase{

  type : SerialRequestType;
  queueId: string;

}

export class SerialResponse extends SerialCommunicationBase {
  type : SerialResponseType;
  queueId?: string;

}

export class SerialActionRequest extends SerialRequest {

  type = SerialRequestType.Action;
  actionType : SerialActionType;
  actionPin : number;
  activationType : SerialActionActivationType;
  duration? : number;

}

export class SerialMeasurementRequest extends SerialRequest {

  type = SerialRequestType.Measurement;
  powerPin: number;
  dataPin: number;
  sensorType: number;

}

export enum SerialResponseType {

  Error = 0,
  Confirmation,
  Measurement,
  Action,
  IsAlive,
  IsBusy,
  

}

export enum SerialRequestType {

  Measurement = 0,
  Action

}

export enum SerialActionType {

  Watering = 0,
  Led

}

export enum SerialActionActivationType {

  TurnOff = 0,
  TurnOn,
  Duration

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
  dataPin: number;

}

export class SerialActionResponse extends SerialResponse {

}