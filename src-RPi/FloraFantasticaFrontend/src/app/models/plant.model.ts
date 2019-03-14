export class Plant {

  id : string;
  name : string;
  icon : string;
  state : number;
  currentData : string;

}

export class PlantDataObj {

  airHumidity: number;
  airTemperature: number;
  soilTemperature: number;
  soilMoisture: number;
  lightIntensity: number;
  lastWatering: number;

  constructor( dataStr : string ){

    var data = JSON.parse(dataStr);

    this.airTemperature = data.airTemperature || null;
    this.airHumidity = data.airHumidity || null;
    this.soilTemperature = data.soilTemperature || null;
    this.soilMoisture = data.soilMoisture || null;
    this.lightIntensity = data.lightIntensity || null;
    this.lastWatering = data.lastWatering || null;

  }

}