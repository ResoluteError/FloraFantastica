import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Sensor } from "../entity/Sensors";

export class SensorController {

  static async get_all(req : Request, res: Response){

    var manager = getManager();

    var data = await manager.find(Sensor);

    res.send(data);

  }

  static async get_by_plant_id(req : Request, res: Response){

    var id = req.params.plantId;
    var manager = getManager();

    var sensors = await manager.find(Sensor, {
      where : {
        currentPlantId : id
      }
    });

    res.send(sensors);

  }

  static async get_by_id(req : Request, res: Response){
    
    var id = req.params.sensorId;

    var manager = getManager();

    var data = await manager.findOne(Sensor, id);

    res.send(data);

  }

  static async post(req : Request, res: Response){

    var sensorData : Partial<Sensor> = req.body;

    var manager = getManager();

    var sensor : Sensor = manager.create( Sensor, sensorData);

    var result = await manager.insert(Sensor, sensor);

    var createdId = result.identifiers[0].id;

    var createdEntity = await manager.find(Sensor, createdId);

    res.send(createdEntity);

  }

  static async delete(req : Request, res: Response){

    var id = req.params.sensorId;

    var manager = getManager();

    var deletingEntity = await manager.findOne(Sensor, id);

    var result = await manager.delete(Sensor, id);

    res.send(deletingEntity);

  }

  static async patch(req : Request, res: Response){

    var id = req.params.sensorId;
    
    res.send("Putting a plant!");
  }

}