import { QueueItem, QueueItemType, SensorTypes } from "./models/QueueItem.model";
import { CONFIG } from "./config";
import * as SerialPort from "serialport";
import { SerialResponse, SerialCommunicationTypes, SerialMeasurementResponse, SerialMeasurementRequest, SerialErrorResponse, SerialErrorCode } from "./models/SerialCommunication.model";
import { Subject } from "rxjs"

/*

  This process keeps the serial connection open 
  and manages the communication with the arduino.

  Case 1: Arduino emits Event

  Case 2: CRON Job requests Arduino Measurement 

  Case 3: Webserver (upon user request) requests Arduino Measurement

*/


export class SerialManager{


  requestQueue : QueueItem[];
  parser : SerialPort.parsers.Readline;
  port : SerialPort;


  constructor(
    private queueSubscribeable: Subject<QueueItem>,
    private responseSubscribeabe: Subject<SerialResponse>
  ){
    
    this.setupSerial();
    this.listenForSerial();

  }


  setupSerial(){

    this.port = new SerialPort(CONFIG.ARDUINO_PORT, {
      baudRate: CONFIG.ARDUINO_BAUD_RATE
    });

    var readline = new SerialPort.parsers.Readline({ delimiter : '\r\n'});
    this.parser = this.port.pipe(readline);
  }

  listenForSerial(){

    this.parser.on( 'data', data => {
      
      try {
        var response : SerialResponse = JSON.parse(data);
        this.responseSubscribeabe.next(response);
      } catch {
        console.log("[SerialManager] String not JSON parseable " + data);
        var errorResponse : SerialErrorResponse = {
          type : SerialCommunicationTypes.Error,
          code: SerialErrorCode.INVALID_SERIAL_RESPONSE,
          message: "Serial string NOT parseable: " + data
        }
        this.responseSubscribeabe.next(errorResponse);
      }
      
    });

  }

  requestMeasurementSerial( data : QueueItem ){

    var sendData : SerialMeasurementRequest = {

      type: SerialCommunicationTypes.Measurement,
      queueId: data.id,
      sensorType: data.sensorType,
      pin: data.pin

    }

    this.port.write( JSON.stringify(data) + "\n", ( err ) => {
  
      console.log(`[SerialManager] Requested Measurement: ${sendData.sensorType} | ${sendData.pin} --`);
  
      if(err){
        console.log("[SerialManager] An error occured: ", err);
      }
  
    });
  
  }

  

}
