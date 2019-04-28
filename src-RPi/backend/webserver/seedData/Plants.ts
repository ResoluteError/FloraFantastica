import { Plant } from "../entities/Plants";

export class PlantSeedData {

  static getData() : Plant[]{
    var seedPlants : Plant[] = [];

    for (var i = 1; i <= 3; i++){

      var newPlant = new Plant();
      newPlant.name = "Test Plant #" + i;
      newPlant.state = i;
      newPlant.currentData = "{}";
      newPlant.icon = "/uploads/seed-plant-img.png";
      seedPlants.push(newPlant);
    }

    return seedPlants;
  }

}