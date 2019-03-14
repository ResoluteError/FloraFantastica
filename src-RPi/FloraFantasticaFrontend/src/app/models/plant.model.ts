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

    var latestSensorMeasurement = JSON.parse(dataStr);
    this.airTemperature = latestSensorMeasurement[10] && latestSensorMeasurement[10].data || null;
    this.airHumidity = latestSensorMeasurement[11] && latestSensorMeasurement[11].data || null;
    this.soilTemperature = latestSensorMeasurement[20] && latestSensorMeasurement[20].data || null;
    this.soilMoisture = latestSensorMeasurement[21] && latestSensorMeasurement[21].data || null;
    this.lightIntensity = latestSensorMeasurement[30] && latestSensorMeasurement[30].data || null;
    this.lastWatering = latestSensorMeasurement[40] && latestSensorMeasurement[40].data || null;

  }

}