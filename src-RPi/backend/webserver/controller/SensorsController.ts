import { Request, Response } from "express";
import { getManager, IsNull } from "typeorm";
import { Sensor } from "../entities/Sensors";

export class SensorController {

  static async getAll(req : Request, res: Response){

    var manager = getManager();

    var data = await manager.find(Sensor);

    res.send(data);

  }

  
  static async getByPlantId(req : Request, res: Response){

    var id = req.params.plantId;
    var manager = getManager();

    var sensors = await manager.find(Sensor, {
      where : {
        currentPlantId : id
      }
    });

    res.send(sensors);

  }
  
  static async getByDataPin(req : Request, res: Response){

    var pin = req.params.dataPin;
    var manager = getManager();

    var sensor = await manager.findOne(Sensor, {
      where : {
        dataPin : pin
      }
    });

    res.send(sensor);

  }

  static async getAvailableSensors(req : Request, res: Response){

    var manager = getManager();
    
    var sensors = await manager.find(Sensor, {
      where : [{
        currentPlantId : IsNull(),
      },{
        currentPlantId : "",
      }]
    });

    res.send(sensors);

  }

  static async getByType(req : Request, res: Response){
    
    var type = req.params.sensorType;

    var manager = getManager();

    var data = await manager.find(Sensor, {
      where : {
        type: type
      }
    });

    res.send(data);

  }
  static async getById(req : Request, res: Response){
    
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

    var createdEntity = await manager.findOne(Sensor, createdId);

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

    var manager = getManager();

    var sensorData : Partial<Sensor> = manager.create(Sensor, req.body);

    var result = await manager.update(Sensor, id, sensorData);

    var updatedEntity = await manager.findOne(Sensor, id);

    res.send(updatedEntity);
  }

}