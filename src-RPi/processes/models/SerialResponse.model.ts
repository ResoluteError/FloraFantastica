export class SerialResponse {

  type : SerialResponseTypes;
  
  requestId?: string;

}

export class SerialResponseTypes {

  Error = "error";
  IsAlive = "isAlive";
  IsBusy = "isBusy";
  Measurement = "Measurement";

}

export class SerialErrorResponse extends SerialResponse{

  message : string;
  code?: number;

}

export class SerialIsAliveResponse extends SerialResponse{

  alive: boolean;

}

export class SerialIsBusyResponse extends SerialResponse{

  busy: boolean;

}

export class SerialMeasurementResponse extends SerialResponse{

  data: number;

}