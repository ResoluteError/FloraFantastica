import { QueueItem } from "./models/QueueItem.model";
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
  private portReady : boolean = false;


  constructor(
    private responseSubscribeabe: Subject<SerialResponse>
  ){
    
    this.setupSerial();
    this.listenForSerial();

  }


  setupSerial(){

    this.port = new SerialPort(CONFIG.ARDUINO_PORT, {
      baudRate: CONFIG.ARDUINO_BAUD_RATE
    }, (err) => {
      if(err){
        console.log("[SerialManager] Error opening serial port!");
        console.log(err);
        return;
      }
      this.portReady = true;
    });
    var readline = new SerialPort.parsers.Readline({ delimiter : '\r\n'});
    this.parser = this.port.pipe(readline);
  }

  getPortStatus(): boolean{
    console.log("[SerialManager] Port Status: " + this.portReady);
    return this.portReady;
  }

  kill(){
    console.log("[SerialManager] Killing Process");
    return process.exit();
  }

  listenForSerial(){
    this.parser.on( 'data', data => {
    
      try {
        var response : SerialResponse = JSON.parse(data);
        console.log(`[SerialManager] Received JSON response`, response);
        this.responseSubscribeabe.next(response);
      } catch {
        console.log("[SerialManager] String not JSON parseable " + data);
        var errorResponse : SerialErrorResponse = {
          type : SerialCommunicationTypes.Error,
          code: SerialErrorCode.INVALID_SERIAL_RESPONSE,
          message: "Serial string NOT parseable: '" + data + "'"
        }
        this.responseSubscribeabe.next(errorResponse);
      }
      
    });

  }

  requestMeasurementSerial( data : any ){

    var sendData : SerialMeasurementRequest = {

      type: SerialCommunicationTypes.Measurement,
      queueId: data.id,
      sensorType: data.sensorType,
      pin: data.pin

    }

    var serializedSendData = JSON.stringify(sendData) + "\0\r\n";

    console.log("[SerialManager] Sending Data: ", serializedSendData);

    this.port.write( JSON.stringify(sendData), ( err ) => {
  
      if(err){
        console.log("[SerialManager] An error occured: ", err);
      }
  
    });
  
  }

  

}
