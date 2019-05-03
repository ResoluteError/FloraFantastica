import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Measurement } from "../entities/Measurement";
import { Sensor } from "../entities/Sensors";
import * as request from "request";

import express = require("express");
import { CONFIG } from "../config";
import { MeasurementQueueItem, QueueItemOrigin, ActionQueueItem } from "../models/QueueItem.model";
import { SerialRequestType, SerialActionActivationType, SerialActionType } from "../models/SerialCommunication.model";
import { MeasurementController } from "./MeasurementsController";
import { Action } from "../entities/Actions";
import { Plant } from "../entities/Plants";

export class ActionsController {


  /// ---------- STANDARD ACTIONS API --------------------- ///

  static async getAll( req : Request, res: Response){
  
    var manager = getManager();

    var data = await manager.find(Action);

    res.send(data);
  
  }

  static async getById( req : Request, res: Response){
  
    var manager = getManager();

    var id = req.params.actionId;

    var data = await manager.findOne(Action, id);

    res.send(data);
  
  }

  static async getByState( req : Request, res: Response){
  
    var manager = getManager();

    var state = req.params.state;

    var data = await manager.find(Action, {where : {state : state}});

    res.send(data);
  
  }

  static async getByPlantId( req : Request, res: Response){
  
    var manager = getManager();

    var plantId = req.params.plantId;

    var data = await manager.find(Action, {where : {plantId : plantId}});

    res.send(data);
  
  }

  static async getLatestByPlantId( req : Request, res: Response){
  
    var manager = getManager();

    var plantId = req.params.plantId;

    var data = await manager.query(`SELECT * FROM action WHERE plantId='${plantId}' ORDER BY createdAt DESC LIMIT 1`);

    if(data && data.length === 1){
      data = data[0];
    }

    res.send(data);
  
  }

  static async getByStateAndPlantId( req : Request, res: Response){
  
    var manager = getManager();

    var plantId = req.params.plantId;
    var state = req.params.state;

    var data = await manager.find(Action, {where : {plantId : plantId, state : state}});

    res.send(data);
  
  }

  static async patch( req : Request, res: Response){
  
    var manager = getManager();

    var actionId = req.params.actionId;

    var editAction = manager.create(Action, req.body);

    var patchActionRes = await manager.update(Action, actionId, editAction);

    var patchedAction = await manager.findOne(Action, actionId);

    res.send(patchedAction);
  
  }


  /// ---------- CUSTOM ACTIONS API --------------------- ///


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

  static async postAction( actionRequest : Partial<ActionQueueItem>, callback : Function){

    const actionReqOptions = {  
      url: `http://localhost:${CONFIG.QUEUE_MANAGER_PORT}/queue`,
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8'
      },
      json: actionRequest
    };

    const manager = getManager();

    request( actionReqOptions, async (err, httpResponse, body) => {

      if(err){
        console.log("postAction Error - ", err);
        await manager.update( Action, actionRequest.id, {
          state : -1
        });
        console.log("Action updated with error");
        return;
      }

      await manager.update( Action, actionRequest.id, {
        state : 1
      });

      console.log("Action updated with success");
      console.log("Completed action request");

      if(callback){
        callback( actionRequest );
      }

    });


  }

  static async wateringAction( req, res){

    var duration = +req.params.duration;
    var actionPin = +req.params.actionPin;
    var plantId = req.params.plantId;

    const manager = getManager();

    var action = manager.create( Action, {
      actionType: 0,
      actionPin: actionPin,
      activationType: 2,
      duration: duration,
      plantId : plantId
    });

    var savedActionRes = await manager.insert(Action, action);

    var actionId = savedActionRes.identifiers[0].id;

    var resultAction = await manager.findOne(Action, actionId);

    var wateringRequest : Partial<ActionQueueItem> = {
      id: actionId,
      origin: QueueItemOrigin.Webserver,
      type: SerialRequestType.Action,
      actionType: SerialActionType.Watering,
      activationType : SerialActionActivationType.Duration,
      actionPin: actionPin,
      duration: duration
    }

    ActionsController.postAction(wateringRequest, async (actionRequest : Partial<ActionQueueItem>) => {

      const manager = getManager();

      const sensor = await manager.findOne(Sensor, {where: {currentPlantId: plantId, type: 40}});

      const wateringMeasurement = manager.create( Measurement, {
        sensorId: sensor.id,
        sensorType: 40,
        plantId: plantId,
        measuredAt: new Date().toISOString(),
        data: +duration
      });

      console.log("Saving Watering Measurement after Watering Action");
      console.log("wateringMeasurement - ", wateringMeasurement);

      var insertResponse = await manager.insert(Measurement, wateringMeasurement);

      const plant = await manager.findOne(Plant, plantId);

      var cData = JSON.parse(plant.currentData);

      wateringMeasurement.id = insertResponse.identifiers[0].id;

      cData[40] = wateringMeasurement;

      await manager.update(Plant, plantId, {
        currentData: JSON.stringify(cData)
      });


    });

    res.status(202).send(resultAction);

  }

}