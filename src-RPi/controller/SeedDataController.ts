import { Request, Response } from "express";
import { getManager, getConnection } from "typeorm";
import { Plant } from "../entity/Plants";
import { PlantSeedData } from "../seedData/Plants";
import { SensorMeasurement } from "../entity/SensorMeasurement";
import { Sensor } from "../entity/Sensors";


export class SeedDataController{

  static async seedPlants(req : Request, res : Response){

    var plantData = PlantSeedData.getData();

    var manager = getManager();

    await manager.insert(Plant, plantData);

    var resultData = await manager.find(Plant);

    res.send("Plant Seed Insert Success: " + JSON.stringify(resultData));

  }

  static async dropSeed( req : Request, res : Response){

    var con = getConnection();

    await con.synchronize(true);

    res.send("Reset Databases");

  }

  static async viewData( req : Request, res : Response){
  
    var manager = getManager();

    var plants = await manager.find(Plant);
    var measurements = await manager.find(SensorMeasurement);
    var sensors = await manager.find(Sensor);
    
    res.send({plants : plants, measurements : measurements, sensors : sensors});

  }

}