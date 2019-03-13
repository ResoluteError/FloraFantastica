import { Request, Response } from "express";
import { getManager } from "typeorm";
import { SensorMeasurement } from "../entity/SensorMeasurement";
import { Sensor } from "../entity/Sensors";


export class SensorMeasurementController {


  static async getAll(req : Request, res : Response){
    
    var manager = getManager();

    var data = await manager.find(SensorMeasurement);

    res.send(data)

  }

  static async getByPlantId(req : Request, res : Response){
    
    var manager = getManager();
    var plantId = req.params.plantId;

    var data = await manager.find(SensorMeasurement, {
      where : {
        plantId : plantId
      }
    });

    res.send(data)

  }

  static async getByPlantIdAndType(req : Request, res : Response){

    var type = req.params.sensorType;
    var plantId = req.params.plantId;
    var manager = getManager();

    var data = await manager.find(SensorMeasurement, {
      where : {
        plantId : plantId,
        sensorType : type
      }
    });

    res.send(data)

  }

  static async getById(req : Request, res : Response){

    var id = req.params.measurementId;
    var manager = getManager();

    var data = await manager.findOne(SensorMeasurement, id);

    res.send(data)

  }

  static async getBySensorId( req : Request, res : Response){

    var sensorId = req.params.sensorId;
    var manager = getManager();

    var data = await manager.find(SensorMeasurement, {
      where : {
        sensorId : sensorId
      }
    });

    res.send(data)

  }

  /*
  * Get the data of a sensor only for when it was associated with a specific plant
  */
  static async getBySensorIdAndPlantId( req : Request, res : Response){

    var sensorId = req.params.sensorId;
    var plantId = req.params.plantId;
    var manager = getManager();

    var data = await manager.find(SensorMeasurement, {
      where : {
        sensorId : sensorId,
        plantId : plantId
      }
    });

    res.send(data)

  }


  static async post(req : Request, res : Response){

    var plantId = req.params.plantId;
    var manager = getManager();

    var newMeasurement = manager.create(SensorMeasurement, req.body);

    var sensor = await manager.findOne( Sensor, newMeasurement.sensorId);

    newMeasurement.sensorType = sensor.type;
    newMeasurement.plantId = plantId;
    newMeasurement.measuredAt = (new Date()).toISOString();

    var result = await manager.insert(SensorMeasurement, newMeasurement);

    var postedEntity = await manager.findOne(SensorMeasurement, result.identifiers[0].id);

    res.send(postedEntity);

  }

  static async delete(req : Request, res : Response){

    var id = req.params.measurementId;
    var plantId = req.params.plantId;
    var manager = getManager();

    var deleteEntity = await manager.findOne(SensorMeasurement, id);

    await manager.delete(SensorMeasurement, id);

    res.send(deleteEntity);

  }

}