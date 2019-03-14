import { Sensor } from "../entity/Sensors";
import { Plant } from "../entity/Plants";

export class SensorSeedData {

  static getData( plants : Partial<Plant>[] ){

    var sensorTypes = [10,11,20,21,30,40];
    var sensors : Sensor[] = [];

    for (var plant of plants){

      var sensorCount = Math.round(Math.random()*3)+1;
      
      for( var i = 1; i <= sensorCount; i++){

        var sensorTypeIndex = Math.round(Math.random() * (sensorTypes.length - 1));

        var newSensor = new Sensor();
        newSensor.name = "Sensor " + i;
        newSensor.state = Math.round(Math.random()*2);
        newSensor.type = sensorTypes[sensorTypeIndex];
        newSensor.currentPlantId = plant.id;

        sensors.push(newSensor);

      }

    }

    return sensors;

  }

}