import { Request, Response } from "express";
import { getManager, EntityManager, getRepository } from "typeorm";
import { Measurement } from "../entities/Measurement";
import { Plant } from "../entities/Plants";
import { Sensor } from "../entities/Sensors";
import * as request from "request";

import express = require("express");
import { CONFIG } from "../config";
import { MeasurementQueueItem, QueueItemOrigin } from "../models/QueueItem.model";
import { SerialRequestType } from "../models/SerialCommunication.model";
import { MeasurementController } from "./MeasurementsController";

export class ActionsController {

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
      sensor = await manager.findOne(Sensor, sensorId);
    } else {
      sensorId = sensor.id;
    }

    var newMeasurement : Partial<Measurement> = {
      sensorId : sensorId,
      sensorType: 90,
      plantId : plantId,
      measuredAt: (new Date()).toISOString(),
      data: req.body.data
    }

    var postedHealthEntry = await MeasurementController.createNewMeasurement(newMeasurement, sensor.currentPlantId, sensor);

    res.send(postedHealthEntry);
  }

  static async checkSensor(req : express.Request, res: express.Response){

    var manager = getManager();

    var sensorId = req.params.sensorId;
    var action = req.params.sensorAction;

    var sensor = await manager.findOne(Sensor,sensorId);

    var measurementRequest : Partial<MeasurementQueueItem> = {
      origin: QueueItemOrigin.Webserver,
      type: SerialRequestType.Measurement,
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

    request(sensorReqOptions, async (err, measureRes, body) =>  {

      if(err || (measureRes && measureRes.statusCode >= 400) || typeof measureRes === "undefined"){
        res.status( (measureRes && measureRes.statusCode) || 400).send(err || "{}");
        return;
      }

      if(action === "check"){

        sensor.state = 2;

        var updatedSensor = await manager.save(sensor);

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

        res.status(202).send(newMeasurement);

      } else {
        console.log("Action not found: ", action);
      }

    });

  }

}