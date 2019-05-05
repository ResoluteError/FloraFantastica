
import * as request from "request";
import { CONFIG } from "./config";
import { Schedule } from "./models/schedule.model";
import { Plant, PlantDataObj } from "./models/plant.model";

(async () => {

  var result = await Promise.all([getPlants(),getSchedules()]);

  if(result && result.length > 1){

    var plants : Plant[] = result[0];
    var schedules : Schedule[] = result[1];

    console.log("Got Plants. Count: ", plants.length);
    console.log("Got Schedules. Count: ", schedules.length);

    schedules.forEach( async (schedule) => {

      var plant = plants.find( plant => plant.id === schedule.plantId);

      var cData = new PlantDataObj(plant.currentData);

      if(schedule.minDurationSinceWatering){

        var diff = Date.now() - new Date(cData.lastWatering).getTime();

        if(diff < (schedule.minDurationSinceWatering * 1000 * 60 * 60)){

          console.log("Difference in duration too small: ", diff, " | ", schedule.minDurationSinceWatering * 1000 * 60 * 60);
          return false;

        }

      }

      if(schedule.minSoilDryness){

        if(cData.soilMoisture < schedule.minSoilDryness){

          console.log("Not dry enough: ", cData.soilMoisture, " | ", schedule.minSoilDryness);
          return false;

        }

      }

      if(schedule.maxLight){

        if(cData.lightIntensity > schedule.maxLight){

          console.log("Too much sun: ", cData.lightIntensity, " | ", schedule.maxLight);
          return false;

        }
      }

      var result = await conductWatering(plant.id, schedule.duration, schedule.valvePin);

    })

  }


  function getPlants(): Promise<Plant[]>{

    return new Promise( (resolve, reject) => {

      const options = {  
        url: `http://localhost:${CONFIG.WEBSERVER_PORT}/api/plants`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'Authorization' : CONFIG.AUTH
        }
      };

      request(options, (err, res, body) => {
        if(err){
          reject(err);
          return;
        }
        
        resolve(JSON.parse(body));
        return;
        
      });

    })

  }

  function getSchedules(): Promise<Schedule[]>{

    const options = {  
      url: `http://localhost:${CONFIG.WEBSERVER_PORT}/api/schedules/active`,
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8',
          'Authorization' : CONFIG.AUTH
      }
    };

    return new Promise( (resolve, reject) => {

      request(options, (err, res, body) => {

        if(err){
          reject(err);
          return;
        }

        resolve(JSON.parse(body));

      });

    });


  }

  function conductWatering( plantId: string, duration: number, pin : number){

    const options = {  
      url: `http://localhost:${CONFIG.WEBSERVER_PORT}/api/actions/watering/pin/${pin}/duration/${duration}/plant/${plantId}`,
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8',
          'Authorization' : CONFIG.AUTH
      }
    };

    return new Promise( (resolve, reject) => {

      request(options, (err, res, body) => {

        if(err){
          reject(err);
          return;
        }

        resolve(JSON.parse(body));

      });

    });



  }

})();