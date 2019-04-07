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
import { Observable } from "rxjs";

(async function (){
    
  var args = parseCliArguments();
  
  if(typeof args["types"]==="string"){
    if(args["types"] === "ALL"){
      getAllSensors().subscribe( sensors => {
        checkSensors(sensors);
      });
    } else {
      getSensorsByType(+args["types"]).subscribe( sensors => {
        checkSensors(sensors);
      });
    }
  } else {
    for( var type of args["types"]){
      var sensors = await getSensorsByType(type).toPromise();
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

  function getSensorsByType(type : number): Observable<string>{
    const options = {  
      url: `http://localhost:${CONFIG.WEBSERVER_PORT}/api/sensors/type/${type}`,
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8'
      }
    };
    return new Observable( observer => {
      request(options, function(err, res, body){
        if(err){
          observer.error(err);
          observer.complete();
          return;
        }
        observer.next(JSON.parse(body));
        observer.complete();  
      });
    });
  }

  function getAllSensors(): Observable<string>{
    const options = {  
      url: `http://localhost:${CONFIG.WEBSERVER_PORT}/api/sensors`,
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8'
      }
    };
    return new Observable( observer => {
      request(options, (err, httpResponse, body) => {
        if(err){
          observer.error(err);
          observer.complete();
          return;
        }
        observer.next(JSON.parse(body));
        observer.complete();  
      })
    });
  }

  function requestSensorMeasurement( sensor ){

    return new Observable( observer => {
      const options = {  
        url: `http://localhost:${CONFIG.QUEUE_MANAGER_PORT}/queue`,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        json: {
          type: "cron",
          sensorId: sensor.id,
          sensorType: sensor.type,
          pin: sensor.pin
        }
      };

      request(options, (err, httpResponse, body) => {
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

  async function checkSensors(sensors){

    for( var sensor of sensors){

      if(sensor.currentPlantId){

        if(sensor.state === 2){

          var request = await requestSensorMeasurement(sensor).toPromise();

        } 

      }

    }

  }



})();
