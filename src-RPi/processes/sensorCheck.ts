/*
  This script is run from a cron job
  It gets the list of all active sensors 
  and synchronously contacts the arduino 
  for the readings of these sensors,
  checking if the arduino is currently
  busy or not. 
*/

import * as request from "request";
import { CONFIG } from "./config";
import { Observable, observable } from "rxjs";

(async function (){
    
  var args = parseCliArguments();

  console.log("args: ", args);
  
  if(typeof args["types"]==="string"){
    getAllSensors().subscribe( sensors => {
      var sensorArr = JSON.parse(sensors);
      console.log("all sensors: ", sensorArr, typeof sensorArr);
      checkSensors(sensorArr);
    });
  } else {
    for( var type of args["types"]){
      var sensors = await getSensorsByType(type).toPromise();
      console.log("typed ", type, " sensors: " , sensors);
      checkSensors(sensors);
    }
  }
    
  function parseCliArguments(){

    var ArgsLength = process.argv.length;
    var execArgs = {};
    var currentArg = 2;

    for( var currentArg = 2, ArgsLength = process.argv.length; currentArg < ArgsLength; currentArg++){

      var str = process.argv[currentArg].replace(" ","");
      var key : string = str.split("=")[0].toLowerCase();
      var valStr : string = str.split("=")[1];
      var val; 

      if(valStr.indexOf("/") > -1){
        val = valStr.split("/");
      } else {
        val = valStr;
      }

      execArgs[key] = val;

    }

    return execArgs;

  }

  function getSensorsByType(type : number){

    return new Observable( observer => {
      request.get(`http://localhost:${CONFIG.WEBSERVER_PORT}/api/sensors/type/${type}`, (err, httpResponse, body) => {
        if(err){
          observer.error(err);
          observer.complete();
          return;
        }
        observer.next(body);
        observer.complete();  
      })
    });
  }

  function getAllSensors(): Observable<string>{

    return new Observable( observer => {
      request.get(`http://localhost:${CONFIG.WEBSERVER_PORT}/api/sensors`, (err, httpResponse, body) => {
        if(err){
          observer.error(err);
          observer.complete();
          return;
        }
        console.log("Body: ", body);
        observer.next(body);
        observer.complete();  
      })
    });
  }

  function requestSensorMeasurement( sensor ){

    return new Observable( observer => {
      request.post(`http://localhost:${CONFIG.QUEUE_MANAGER_PORT}/queue`,{
        json: {
          type: "cron",
          sensorId: sensor.id,
          sensorType: sensor.type,
          pin: sensor.pin
        }
      }, (err, httpResponse, body) => {
        if(err){
          observer.error(err);
          observer.complete();
          return;
        }
        observer.next(body);
        observer.complete();  
      })
    });

  }

  function checkSensors(sensors){

    for( var sensor of sensors){

      if(sensor.currentPlantId){

        if(sensor.state === 2){

          requestSensorMeasurement(sensor);

        }

      }

    }

  }



})();
