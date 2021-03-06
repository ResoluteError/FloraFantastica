export class Plant {

  id : string;
  name : string;
  icon : string;
  state : number;
  currentData : string;
  description: string;

}

export class PlantDataObj {

  airHumidity: number;
  airTemperature: number;
  soilTemperature: number;
  soilMoisture: number;
  lightIntensity: number;
  lastWatering: string;
  lastHealth: number;

  constructor( dataStr : string ){

    var latestSensorMeasurement = JSON.parse(dataStr);
    this.airTemperature = latestSensorMeasurement[10] && latestSensorMeasurement[10].data || null;
    this.airHumidity = latestSensorMeasurement[11] && latestSensorMeasurement[11].data || null;
    this.soilMoisture = latestSensorMeasurement[20] && latestSensorMeasurement[20].data || null;
    this.soilTemperature = latestSensorMeasurement[21] && latestSensorMeasurement[21].data || null;
    this.lightIntensity = latestSensorMeasurement[30] && latestSensorMeasurement[30].data || null;
    this.lastWatering = latestSensorMeasurement[40] && new Date(latestSensorMeasurement[40].measuredAt).toLocaleString() || null;
    this.lastHealth = latestSensorMeasurement[90] && latestSensorMeasurement[90].data || null;

  }

}