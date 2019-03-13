import { Request, Response } from "express";

export class SensorController {

  static get_all(req : Request, res: Response){
  
    res.send("Getting a all sensors..." );

  }

  static get_by_id(req : Request, res: Response){
    
    var id = req.params.sensorId;

    res.send("Getting a specific sensor..." );
  }

  static post(req : Request, res: Response){

    res.send("Posting a sensor!");

  }

  static delete(req : Request, res: Response){

    var id = req.params.sensorId;

    res.send("Deleting a sensor!");

  }

  static put(req : Request, res: Response){

    var id = req.params.sensorId;
    
    res.send("Putting a plant!");
  }

}