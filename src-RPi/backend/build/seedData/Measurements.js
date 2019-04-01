"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Measurement_1 = require("../entity/Measurement");
var MeasurementSeedData = (function () {
    function MeasurementSeedData() {
    }
    MeasurementSeedData.getData = function (sensors) {
        var measurements = [];
        for (var _i = 0, sensors_1 = sensors; _i < sensors_1.length; _i++) {
            var sensor = sensors_1[_i];
            var numOfMeasurements;
            if (sensor.type == 40) {
                numOfMeasurements = 6;
            }
            else {
                numOfMeasurements = 40;
            }
            for (var i = 0; i < numOfMeasurements; i++) {
                var randomDate = Date.now() - Math.round(Math.random() * (1000 * 60 * 60 * 24 * 7));
                var newMeasurement = new Measurement_1.Measurement();
                newMeasurement.plantId = sensor.currentPlantId;
                newMeasurement.sensorId = sensor.id;
                newMeasurement.sensorType = sensor.type;
                newMeasurement.measuredAt = new Date(randomDate).toISOString();
                newMeasurement.data = MeasurementSeedData.mockData(sensor.type);
                measurements.push(newMeasurement);
            }
        }
        return measurements;
    };
    MeasurementSeedData.mockData = function (sensorType) {
        switch (sensorType) {
            case 10: return 35 + Math.round(Math.random() * 400) / 10;
            case 11: return 15 + Math.round(Math.random() * 100) / 10;
            case 20: return 33000 + Math.round(Math.random() * 30000);
            case 21: return 12 + Math.round(Math.random() * 80) / 10;
            case 30: return 200 + Math.round(Math.random() * 400);
            case 40: return 1500 + Math.round(Math.random() * 3500);
            default:
                console.log("Sensor type " + sensorType + " has no mock config!");
                return 0;
        }
    };
    return MeasurementSeedData;
}());
exports.MeasurementSeedData = MeasurementSeedData;
//# sourceMappingURL=Measurements.js.map