import { QueueItem } from "./models/QueueItem.model";
import express = require("express");
import { CONFIG } from "./config";
import * as SerialPort from "serialport";

/*

  This process keeps the serial connection open 
  and manages the communication with the arduino.

  Case 1: Arduino emits Event

  Case 2: CRON Job requests Arduino Measurement 

  Case 3: Webserver (upon user request) requests Arduino Measurement

*/


var requestQue : QueueItem[] = [];

const app = express();

const serialPort = new SerialPort(CONFIG.ARDUINO_PORT, {
  baudRate: CONFIG.ARDUINO_BAUD_RATE
});

var readline = new SerialPort.parsers.Readline({ delimiter : '\r\n'});
var parser = serialPort.pipe(readline);

parser.on( 'data', data => {
  
  try {
    var dataObj = JSON.parse(data);
    
  } catch (err) {
    console.log("Unspecified Serial String: ", data);
  }

});

app.listen(CONFIG.SERIAL_MANAGER_PORT, ()=>{
  console.log("[Serial Manager] Listening on port: " + CONFIG.SERIAL_MANAGER_PORT);
});