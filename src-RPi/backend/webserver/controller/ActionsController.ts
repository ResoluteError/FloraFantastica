import { Request, Response } from "express";
import { getManager, EntityManager, getRepository } from "typeorm";
import { Measurement } from "../entities/Measurement";
import { Plant } from "../entities/Plants";
import { Sensor } from "../entities/Sensors";
import * as request from "request";

import express = require("express");
import { CONFIG } from "../config";

export class ActionsController {
  
  static async updatePlantCurrentData(req : Request, res: Response){
  
    var plantId = req.params.plantId;

    var repository = getRepository(Measurement);

    // Get the latest entry per sensorType of a specific plant
    var timesAndTypes = await repository.createQueryBuilder("measurement")
      .select("MAX (measuredAt)", "measuredAt")
      .addSelect("sensorType")
      .where("plantId = :plantId", {plantId : plantId})
      .groupBy("sensorType")
      .execute();

    var dataDict = {};
    
    for (var timeAndType of timesAndTypes){

      // Get the entire measurement of the latest entry of a sensorType
      dataDict[timeAndType.sensorType] = await repository.createQueryBuilder("measurement")
      .where("plantId = :plantId", {plantId : plantId})
      .andWhere("measuredAt = :measuredAt", {measuredAt : timeAndType.measuredAt})
      .andWhere("sensorType = :sensorType", {sensorType : timeAndType.sensorType})
      .getOne()

    }

    var dataStr = JSON.stringify(dataDict);

    var manager = getManager();

    await manager.update(Plant, plantId, {currentData : dataStr});

    var result = await manager.findOne(Plant, plantId);

    res.send(result);

  }


  static async postHealthEntry(req : Request, res: Response){
    var manager = getManager();

    var plantId = req.params.plantId;
    var sensorId : string;

    var sensor = await manager.findOne( Sensor, {
      where: {
        currentPlantId: plantId,
        type: 90
      }
    });

    // Create Sensor if none exists yet
    if(!sensor){
      var result = await manager.insert(Sensor, {
        currentPlantId: plantId,
        name: "Health Entries",
        dataPin: null,
        powerPin: null,
        type: 90,
        state: 0
      });
      sensorId = result.identifiers[0].id;
    } else {
      sensorId = sensor.id;
    }

    var newMeasurement = await manager.insert(Measurement, {
      sensorId : sensorId,
      sensorType : 90,
      plantId : plantId,
      measuredAt: (new Date()).toISOString(),
      data: req.body.data
    });

    var postedEntity = await manager.findOne(Measurement, newMeasurement.identifiers[0].id);

    res.send(postedEntity);
  }

  static async checkSensor(req : express.Request, res: express.Response){

    var manager = getManager();

    var sensorId = req.params.sensorId;
    var action = req.params.sensorAction;

    var sensor = await manager.findOne(Sensor,sensorId);

    var measurementRequest = {
      type: "webserver",
      sensorId: sensorId,
      sensorType: sensor.type,
      dataPin: sensor.dataPin,
      powerPin: sensor.powerPin
    }

    const sensorReqOptions = {  
      url: `http://localhost:${CONFIG.QUEUE_MANAGER_PORT}/queue`,
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8'
      },
      json: measurementRequest
    };

    console.log("Checking Sensor Status of sensor: ", sensor.name);

    request(sensorReqOptions, async (err, measureRes, body) =>  {

      if(err || measureRes.statusCode >= 400){
        res.status(measureRes.statusCode).send(err || "{}");
        return;
      }

      if(action === "check"){

        sensor.state = 2;

        var updatedSensor = await manager.save(sensor);
        console.log("Updated sensor status: ", sensor);

        res.send(sensor);

      } else if(action === "measure"){

        var newMeasurement : Measurement = {
          sensorId : sensor.id,
          sensorType : sensor.type,
          data : body.data,
          plantId : sensor.currentPlantId,
          measuredAt : new Date().toISOString(),
          id : null
        }

        var measurement = await manager.insert(Measurement, newMeasurement);

        console.log("Created measurement: ", newMeasurement);

        res.status(202).send(newMeasurement);

      }

    });

  }

}