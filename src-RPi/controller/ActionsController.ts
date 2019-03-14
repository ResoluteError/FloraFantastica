import { Request, Response } from "express";
import { getManager, EntityManager, getRepository } from "typeorm";
import { Measurement } from "../entity/Measurement";
import { Plant } from "../entity/Plants";

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

}