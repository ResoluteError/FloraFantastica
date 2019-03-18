import { Sensor } from "./sensor.model";

export class Measurement {

  id: number;
  sensorId: string;
  sensorType: number;
  plantId: string;
  measuredAt: string;
  data: number;

  /**
   * 
   * @param measurements 
   * @param order - "asc" or "desc", default : "asc"
   */
  static sortByDate( measurements : Measurement[], order? : string){

    var result = measurements.sort((a,b) => {
      var aDate = new Date(a.measuredAt);
      var bDate = new Date(b.measuredAt);
      if(order == "desc"){
        return bDate.getTime() - aDate.getTime();
      } else {
        return aDate.getTime() - bDate.getTime();
      }
    });

    return result;

  }

  static getDistinctSensors( measurements : Measurement[] ): Partial<Sensor>[]{

    const result : Partial<Sensor>[] = [];
    const map = new Map();
    for (const measurement of measurements) {
        if(!map.has(measurement.sensorId)){
            map.set(measurement.sensorId, true);    // set any value to Map
            result.push({
              id: measurement.sensorId,
              type: measurement.sensorType
            });
        }
    }

    return result;
  }

}