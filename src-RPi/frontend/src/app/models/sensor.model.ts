import { Plant } from "./plant.model";

export class Sensor {

  id : string;
  currentPlantId?: string;
  name: string;
  type: number;
  state: number;
  powerPin: number;
  dataPin: number;

  static typeToLabel( sensorType : number){
    var labels = {
      10 : "Air Temperature",
      11 : "Air Humidity",
      20 : "Soil Moisture",
      21 : "Soil Temperature",
      30 : "Light Intensity",
      40 : "Watering Activity",
      90 : "Health Status"
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

  static typeToIcons( sensorType: number ): string[]{
    var icons = {
      10 : ["air","temperature"],
      11 : ["air","humidity"],
      20 : ["soil","humidity"],
      21 : ["soil","temperature"],
      30 : ["fas-sun"],
      40 : ["fas-power-off","fas-cloud-showers-heavy"]
    }
    return icons[sensorType];
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

  static stateToString(state : number): string{
    var states = [
      'Unknown',
      'Paused',
      'Active'
    ];
    return states[state];
  }

  static stateToIcon(state : number):string[]{
    var icons = [
      ['far','question-circle'],
      ['far','pause-circle'],
      ['far','play-circle'],
    ]
    return icons[state];
  }

  static toDisplaySensor(sensor: Sensor, plants: Plant[]): DisplaySensor{
    return {
      ...sensor,
      typeIcons: Sensor.typeToIcons(sensor.type),
      typeLabel: Sensor.typeToLabel(sensor.type),
      stateIcon: Sensor.stateToIcon(sensor.state),
      stateLabel: Sensor.stateToString(sensor.state),
      unit: Sensor.typeToUnit(sensor.type),
      currentPlantName: sensor.currentPlantId ? plants.find( plant => plant.id === sensor.currentPlantId).name : "None"
    }
  }

}

export class DisplaySensor extends Sensor {

  currentPlantName?: string;
  typeIcons : string[];
  typeLabel: string;
  stateIcon : string[];
  stateLabel : string;
  unit: string;


}