"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sensors_1 = require("../entities/Sensors");
var SensorSeedData = (function () {
    function SensorSeedData() {
    }
    SensorSeedData.getData = function (plants) {
        var sensorTypes = [10, 11, 20, 21, 30, 40];
        var sensors = [];
        for (var _i = 0, plants_1 = plants; _i < plants_1.length; _i++) {
            var plant = plants_1[_i];
            var sensorCount = Math.round(Math.random() * 3) + 1;
            for (var i = 1; i <= sensorCount; i++) {
                var sensorTypeIndex = Math.round(Math.random() * (sensorTypes.length - 1));
                var newSensor = new Sensors_1.Sensor();
                newSensor.name = "Sensor " + i;
                newSensor.state = Math.round(Math.random() * 2);
                newSensor.type = sensorTypes[sensorTypeIndex];
                newSensor.currentPlantId = plant.id;
                sensors.push(newSensor);
            }
        }
        return sensors;
    };
    return SensorSeedData;
}());
exports.SensorSeedData = SensorSeedData;
//# sourceMappingURL=Sensors.js.map