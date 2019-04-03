import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Measurement } from "../entity/Measurement";
import { Sensor } from "../entity/Sensors";


export class MeasurementController {


  static async getAll(req : Request, res : Response){
    
    var manager = getManager();

    var data = await manager.find(Measurement);

    res.send(data)

  }

  static async getByPlantId(req : Request, res : Response){
    
    var manager = getManager();
    var plantId = req.params.plantId;

    var data = await manager.find(Measurement, {
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

    var data = await manager.find(Measurement, {
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

    var data = await manager.findOne(Measurement, id);

    res.send(data)

  }

  static async getBySensorId( req : Request, res : Response){

    var sensorId = req.params.sensorId;
    var manager = getManager();

    var data = await manager.find(Measurement, {
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

    var data = await manager.find(Measurement, {
      where : {
        sensorId : sensorId,
        plantId : plantId
      }
    });

    res.send(data)

  }


  static async post(req : Request, res : Response){

    var manager = getManager();

    console.log("Got Measurement POST Request: ", typeof req.body, req.body);

    var newMeasurement = manager.create(Measurement, req.body);

    var sensor = await manager.findOne( Sensor, newMeasurement.sensorId);

    newMeasurement.sensorType = sensor.type;
    newMeasurement.plantId = sensor.currentPlantId;
    newMeasurement.measuredAt = newMeasurement.measuredAt || (new Date()).toISOString();

    var result = await manager.insert(Measurement, newMeasurement);

    var postedEntity = await manager.findOne(Measurement, result.identifiers[0].id);

    res.send(postedEntity);

  }

  static async delete(req : Request, res : Response){

    var id = req.params.measurementId;

    var manager = getManager();

    var deleteEntity = await manager.findOne(Measurement, id);

    await manager.delete(Measurement, id);

    res.send(deleteEntity);

  }

}