import { Request, Response } from "express";
import { getManager, CreateDateColumn } from "typeorm";
import { Plant } from "../entity/Plants";
import fs = require('fs');
import mime = require('mime-types');

export class PlantsController {

  static async get_all(req : Request, res: Response){
  
    var manager = getManager();

    var data = await manager.find(Plant);

    res.send(data);

  }

  static async get_by_id(req : Request, res: Response){
    
    var id = req.params.plantId;

    var manager = getManager();

    var data = await manager.findOne(Plant, id);

    res.send(data);
    
  }

  static async post(req : Request, res: Response){

    var plantData : Partial<Plant> = req.body;
    try {
      var folder = Date.now();
      plantData.icon = `/uploads/${folder}/${req.file.originalname}`;
      var savePath = `${__dirname}/../public/uploads/${folder}/`;
      fs.mkdirSync(savePath, {recursive: true});
      fs.writeFileSync(savePath + req.file.originalname, req.file.buffer);
    } catch (err){
    }

    plantData.state = plantData.state || 0;
    plantData.currentData = plantData.currentData || "{}";

    var manager = getManager();

    var plant : Plant = manager.create( Plant, plantData);

    var result = await manager.insert(Plant, plant);

    var createdId = result.identifiers[0].id;

    var createdEntity = await manager.findOne(Plant, createdId);

    res.send(createdEntity);

  }

  /*
   * Returns the deleted object
   */
  static async delete(req : Request, res: Response){

    var id = req.params.plantId;

    var manager = getManager();

    var deletingEntity = await manager.findOne(Plant, id );

    var result = await manager.delete(Plant, id);

    res.send(deletingEntity);

  }

  /*
   * Returns the patched object
   */
  static async patch(req : Request, res: Response){

    var id = req.params.plantId;
    

    var manager = getManager();

    var plantData : Partial<Plant> = manager.create(Plant, req.body);

    try {
      var folder = Date.now();
      plantData.icon = `/uploads/${folder}/${req.file.originalname}`;
      var savePath = `${__dirname}/../public/uploads/${folder}/`;
      fs.mkdirSync(savePath, {recursive: true});
      fs.writeFileSync(savePath + req.file.originalname, req.file.buffer);
    } catch (err){
    }

    var result = await manager.update(Plant, id, plantData);

    var updatedEntity = await manager.findOne(Plant, id);

    res.send(updatedEntity);

  }

}