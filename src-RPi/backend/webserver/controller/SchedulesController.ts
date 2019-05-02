import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Schedule } from "../entities/Schedules";

export class SchedulesController {

  static async getAll( req: Request, res: Response){
  
    var manager = getManager();

    console.log("Getting all schedules")

    var data = await manager.find(Schedule);

    res.send(data);
  
  }

  static async getById( req : Request, res: Response){
  
    var manager = getManager();

    var id = req.params.scheduleId;

    var data = await manager.findOne(Schedule, id);

    res.send(data);
  
  }

  static async getActive( req : Request, res: Response){
  
    var manager = getManager();

    var data = await manager.find(Schedule, {where: {active : true}});

    res.send(data);
  
  }

  static async post( req : Request, res: Response){

    var manager = getManager();

    var schedule = manager.create(Schedule, req.body);

    var creationResponse = await manager.insert(Schedule, schedule);

    var createdId = creationResponse.identifiers[0].id;

    var createdSchedule = await manager.findOne(Schedule, createdId);

    res.send(createdSchedule);

  }

  static async patch( req : Request, res: Response){

    var manager = getManager();

    var id = req.params.scheduleId;

    var schedule = manager.create(Schedule, req.body);

    var result = await manager.update(Schedule, id, schedule);

    var updatedEntity = await manager.findOne(Schedule, id);

    res.send(updatedEntity);

  }

  static async delete(req : Request, res: Response){

    var id = req.params.scheduleId;

    var manager = getManager();

    var deletingEntity = await manager.findOne(Schedule, id );

    var result = await manager.delete(Schedule, id);

    res.send(deletingEntity);

  }


}