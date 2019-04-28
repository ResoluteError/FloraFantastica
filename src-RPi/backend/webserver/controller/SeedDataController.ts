import { Request, Response } from "express";
import { getManager, getConnection } from "typeorm";
import { Plant } from "../entities/Plants";
import { PlantSeedData } from "../seedData/Plants";
import { Measurement } from "../entities/Measurement";
import { Sensor } from "../entities/Sensors";
import { SensorSeedData } from "../seedData/Sensors";
import { MeasurementSeedData } from "../seedData/Measurements";


export class SeedDataController{

  static async seedPlants(req : Request, res : Response){

    var plantData = PlantSeedData.getData();

    var manager = getManager();

    await manager.insert(Plant, plantData);

    var resultData = await manager.find(Plant);

    res.send(resultData);

  }

  static async seedSensors(req : Request, res : Response){

    var manager = getManager();
    
    var plantIds = await manager.find(Plant, {
      select : ["id"]
    });

    var sensorData = SensorSeedData.getData(plantIds);

    await manager.insert(Sensor, sensorData);

    var resultData = await manager.find(Sensor);

    res.send(resultData);

  }

  static async seedMeasurements(req : Request, res : Response){

    var manager = getManager();
    
    var sensors = await manager.find(Sensor);

    var measurementData = MeasurementSeedData.getData(sensors);

    var insertBlock : Measurement[];

    while( (insertBlock = measurementData.splice(0,5)).length ){

      await manager.insert(Measurement, insertBlock);

    }

    var resultData = await manager.find(Measurement);

    res.send(resultData);

  }



  static async dropSeed( req : Request, res : Response){

    var con = getConnection();

    await con.synchronize(true);

    res.send("Reset Databases");

  }

  static async viewData( req : Request, res : Response){
  
    var manager = getManager();

    var plants = await manager.find(Plant);
    var measurements = await manager.find(Measurement);
    var sensors = await manager.find(Sensor);
    
    res.send({plants : plants, measurements : measurements, sensors : sensors});

  }

}