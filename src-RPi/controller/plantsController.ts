import { Request, Response } from "express";

export class PlantsController {

  static get_all(req : Request, res: Response){
    res.send("hi there!");
  }

  static get_by_id(req : Request, res: Response){
    
    var id = req.params.id;

    res.send("Getting a specific one..." );
  }

  static post(req : Request, res: Response){
    res.send("Posting a plant!");
  }

  static delete(req : Request, res: Response){
    res.send("Deleting a plant!");
  }

  static put(req : Request, res: Response){
    res.send("Putting a plant!");
  }

}