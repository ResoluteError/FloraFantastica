"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Plants_1 = require("../entity/Plants");
var PlantSeedData = (function () {
    function PlantSeedData() {
    }
    PlantSeedData.getData = function () {
        var seedPlants = [];
        for (var i = 1; i <= 3; i++) {
            var newPlant = new Plants_1.Plant();
            newPlant.name = "Test Plant #" + i;
            newPlant.state = i;
            newPlant.currentData = "{}";
            newPlant.icon = "/uploads/seed-plant-img.png";
            seedPlants.push(newPlant);
        }
        return seedPlants;
    };
    return PlantSeedData;
}());
exports.PlantSeedData = PlantSeedData;
//# sourceMappingURL=Plants.js.map