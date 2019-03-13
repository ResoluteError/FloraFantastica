import { Request, Response } from "express";


export class SensorMeasurementController {


  static getByType(req : Request, res : Response){

    var type = req.params.sensorType;
    var plantId = req.params.plantId;

    res.send("Get measurement by sensor type.")

  }

  static getById(req : Request, res : Response){

    var id = req.params.sensorId;
    var plantId = req.params.plantId;

    res.send("Get measurement by sensor id.")

  }

  static getAll(req : Request, res : Response){
    
    var plantId = req.params.plantId;

    res.send("Get all measurements.")

  }

  static post(req : Request, res : Response){

    var plantId = req.params.plantId;

    res.send("Post a measurement.")

  }

  static delete(req : Request, res : Response){

    var id = req.params.measurementId;
    var plantId = req.params.plantId;

    res.send("Delete a measurement.")


  }

}