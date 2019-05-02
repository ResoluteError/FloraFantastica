import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Measurement } from "../entities/Measurement";
import { Sensor } from "../entities/Sensors";
import { Plant } from "../entities/Plants";


export class MeasurementController {


  static async getAll(req : Request, res : Response){
    
    var manager = getManager();

    console.log("Getting all measurements")

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

    var newMeasurement = manager.create(Measurement, {
      sensorId : req.body.sensorId,
      measuredAt : req.body.measuredAt,
      data: req.body.data
    });

    var plantId = req.body.plantId;

    res.send(await MeasurementController.createNewMeasurement(newMeasurement, plantId));

  }

  static createNewMeasurement( newMeasurement : Partial<Measurement>, plantId: string, sensor? : Sensor) : Promise<Measurement>{

    return new Promise( async (resolve, reject) => {

      var manager = getManager();

      var plant : Plant;

      if(!sensor){

        var requests = await Promise.all([manager.findOne( Sensor, newMeasurement.sensorId), manager.findOne(Plant, plantId)]);
  
        sensor = requests[0];
        plant = requests[1];

      } else {

        plant = await manager.findOne(Plant, plantId);

      }
  
      newMeasurement.sensorType = sensor.type;
      newMeasurement.plantId = sensor.currentPlantId;
      newMeasurement.measuredAt = newMeasurement.measuredAt || (new Date()).toISOString();
  


      var currentData = JSON.parse(plant.currentData);
  
      var result = await manager.insert(Measurement, newMeasurement);
  
      var postedEntity = await manager.findOne(Measurement, result.identifiers[0].id);
  
      currentData[sensor.type] = postedEntity;
  
      resolve(postedEntity);

      await manager.update(Plant, plant.id, {currentData : JSON.stringify(currentData)});
      
    });
  }

  static async delete(req : Request, res : Response){

    var id = req.params.measurementId;

    var manager = getManager();

    var deleteEntity = await manager.findOne(Measurement, id);

    await manager.delete(Measurement, id);

    res.send(deleteEntity);

  }

}