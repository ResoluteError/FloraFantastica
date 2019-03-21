import { Request, Response } from "express";
import { getManager, EntityManager, getRepository } from "typeorm";
import { Measurement } from "../entity/Measurement";
import { Plant } from "../entity/Plants";
import { Sensor } from "../entity/Sensors";

export class ActionsController {
  
  static async updatePlantCurrentData(req : Request, res: Response){
  
    var plantId = req.params.plantId;

    var repository = getRepository(Measurement);

    // Get the latest entry per sensorType of a specific plant
    var timesAndTypes = await repository.createQueryBuilder("measurement")
      .select("MAX (measuredAt)", "measuredAt")
      .addSelect("sensorType")
      .where("plantId = :plantId", {plantId : plantId})
      .groupBy("sensorType")
      .execute();

    var dataDict = {};
    
    for (var timeAndType of timesAndTypes){

      // Get the entire measurement of the latest entry of a sensorType
      dataDict[timeAndType.sensorType] = await repository.createQueryBuilder("measurement")
      .where("plantId = :plantId", {plantId : plantId})
      .andWhere("measuredAt = :measuredAt", {measuredAt : timeAndType.measuredAt})
      .andWhere("sensorType = :sensorType", {sensorType : timeAndType.sensorType})
      .getOne()

    }

    var dataStr = JSON.stringify(dataDict);

    var manager = getManager();

    await manager.update(Plant, plantId, {currentData : dataStr});

    var result = await manager.findOne(Plant, plantId);

    res.send(result);

  }


  static async postHealthEntry(req : Request, res: Response){
    var manager = getManager();

    var plantId = req.params.plantId;
    var sensorId : string;

    var sensor = await manager.findOne( Sensor, {
      where: {
        currentPlantId: plantId,
        type: 90
      }
    });

    // Create Sensor if none exists yet
    if(!sensor){
      var result = await manager.insert(Sensor, {
        currentPlantId: plantId,
        name: "Health Entries",
        pin: null,
        type: 90,
        state: 0
      });
      sensorId = result.identifiers[0].id;
    } else {
      sensorId = sensor.id;
    }

    var newMeasurement = await manager.insert(Measurement, {
      sensorId : sensorId,
      sensorType : 90,
      plantId : plantId,
      measuredAt: (new Date()).toISOString(),
      data: req.body.data
    });

    var postedEntity = await manager.findOne(Measurement, newMeasurement.identifiers[0].id);

    res.send(postedEntity);
  }

}