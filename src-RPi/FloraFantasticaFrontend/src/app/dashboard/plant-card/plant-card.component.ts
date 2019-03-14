import { Component, OnInit, Input } from '@angular/core';
import { Plant, PlantDataObj } from 'src/app/models/plant.model';
import { SensorService } from 'src/app/services/sensor.service';
import { Sensor } from 'src/app/models/sensor.model';
import { ActionService } from 'src/app/services/action.service';

@Component({
  selector: 'app-plant-card',
  templateUrl: './plant-card.component.html',
  styleUrls: ['./plant-card.component.scss']
})
export class PlantCardComponent implements OnInit {

  @Input( "plant" ) plant : Plant;
  
  plantData : PlantDataObj;
  sensors : Sensor[] = [];

  constructor(
    private sensorService : SensorService,
    private actionService : ActionService
  ) { }

  ngOnInit() {
    

    this.plantData = new PlantDataObj(this.plant.currentData);

    this.sensorService.getSensorsByPlantId(this.plant.id).subscribe( sensors => {

      this.sensors = sensors;

    }, err => {

      // Todo Alert Syste,

    })
  }

  updateCurrentPlantData(){
    this.actionService.updatePlantCurrentData(this.plant.id).subscribe( updatedPlant => {

      this.plantData = new PlantDataObj(updatedPlant.currentData);

    }, err => {
       
      // TODO alert system 

    })
  }

  /* 
  // Use for icons later
  get airTemperature(){
    try {
      return this.currentData.airTemperature || "test";
    } catch {
      return "test";
    }
  }

  get airHumidity(){
    try {
      return this.currentData.airHumidity;
    } catch {
      return null
    }
  }

  get soilTemperature(){
    try {
      return this.currentData.soilTemperature;
    } catch {
      return null
    }
  }

  get soilMoisture(){
    try {
      return this.currentData.soilMoisture;
    } catch {
      return null
    }
  }

  get lightIntensity(){
    try {
      return this.currentData.lightIntensity;
    } catch {
      return null
    }
  }

  get lastWatering(){
    try {
      return this.currentData.lastWatering;
    } catch {
      return null
    }
  }*/

}
