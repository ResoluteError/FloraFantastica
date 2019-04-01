import { Sensor } from "../entity/Sensors";
import { Measurement } from "../entity/Measurement";

export class MeasurementSeedData {

  static getData( sensors : Sensor[] ): Measurement[]{

    var measurements : Measurement[]= [];

    for( var sensor of sensors){
      
      var numOfMeasurements;

      if(sensor.type == 40){
        numOfMeasurements = 6;
      } else {
        numOfMeasurements = 40;
      }

      for( var i = 0; i < numOfMeasurements; i++){
      
        var randomDate = Date.now() - Math.round(Math.random() * (1000 * 60 * 60 * 24 * 7));

        var newMeasurement = new Measurement();
        
        newMeasurement.plantId = sensor.currentPlantId;
        newMeasurement.sensorId = sensor.id;
        newMeasurement.sensorType = sensor.type;
        newMeasurement.measuredAt = new Date(randomDate).toISOString();
  
        newMeasurement.data = MeasurementSeedData.mockData(sensor.type);

        measurements.push(newMeasurement);
      
      }

    }

    return measurements;

  }

  static mockData( sensorType : number): number{

    switch(sensorType){

      // Air Humidity
      case 10: return 35 + Math.round(Math.random() * 400)/10;

      // Air Temperature
      case 11: return 15 + Math.round(Math.random() * 100)/10;

      // Soil Moisutre Frequency
      case 20: return 33000 + Math.round(Math.random() * 30000);

      // Soil Temperature
      case 21: return 12 + Math.round(Math.random() * 80)/10;

      // Ground Light Resistance
      case 30: return 200 + Math.round( Math.random() * 400);

      // Waterin Button Click Duration in MS
      case 40: return 1500 + Math.round(Math.random() * 3500)

      default:
        console.log("Sensor type " + sensorType + " has no mock config!")
        return 0;

    }

  }

}