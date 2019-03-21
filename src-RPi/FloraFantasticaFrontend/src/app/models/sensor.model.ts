export class Sensor {

  id : string;
  currentPlantId?: string;
  name: string;
  type: number;
  state: number;
  pin: string;

  static typeToLabel( sensorType : number){
    var labels = {
      10 : "Air Temperature",
      11 : "Air Humidity",
      20 : "Soil Moisture",
      21 : "Soil Temperature",
      30 : "Light Intensity",
      40 : "Watering Activity"
    }
    return labels[sensorType] || "Unknown";
  }

  static typeToUnit( sensorType : number){
    var units = {
      10 : "° C",
      11 : "%",
      20 : " fq",
      21 : "° C",
      30 : " res",
      40 : " ms",
      90: "",
    }
    return units[sensorType];
  }

  static labelToType(sensorLabel : string){
    var labels = {
      "Air Temperature" : 10,
      "Air Humidity": 11,
      "Soil Moisture": 20,
      "Soil Temperature": 21,
      "Light Intensity": 30,
      "Watering Activity": 40 
    }

    return labels[sensorLabel] || 0;
  }

  static stateToString(state : number){
    var states = [
      'Unknown',
      'Paused',
      'Active'
    ];
    return states[state];
  }

}