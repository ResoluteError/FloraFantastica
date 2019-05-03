"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Plant = (function () {
    function Plant() {
    }
    return Plant;
}());
exports.Plant = Plant;
var PlantDataObj = (function () {
    function PlantDataObj(dataStr) {
        var latestSensorMeasurement = JSON.parse(dataStr);
        this.airTemperature = latestSensorMeasurement[10] && latestSensorMeasurement[10].data || null;
        this.airHumidity = latestSensorMeasurement[11] && latestSensorMeasurement[11].data || null;
        this.soilMoisture = latestSensorMeasurement[20] && latestSensorMeasurement[20].data || null;
        this.soilTemperature = latestSensorMeasurement[21] && latestSensorMeasurement[21].data || null;
        this.lightIntensity = latestSensorMeasurement[30] && latestSensorMeasurement[30].data || null;
        this.lastWatering = latestSensorMeasurement[40] && new Date(latestSensorMeasurement[40].measuredAt).toLocaleString() || null;
        this.lastHealth = latestSensorMeasurement[90] && latestSensorMeasurement[90].data || null;
    }
    return PlantDataObj;
}());
exports.PlantDataObj = PlantDataObj;
//# sourceMappingURL=plant.model.js.map