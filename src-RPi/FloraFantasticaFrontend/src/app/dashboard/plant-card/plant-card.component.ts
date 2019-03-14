import { Component, OnInit, Input } from '@angular/core';
import { Plant, PlantDataObj } from 'src/app/models/plant.model';
import { SensorService } from 'src/app/services/sensor.service';
import { Sensor } from 'src/app/models/sensor.model';
import { ActionService } from 'src/app/services/action.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-plant-card',
  templateUrl: './plant-card.component.html',
  styleUrls: ['./plant-card.component.scss']
})
export class PlantCardComponent implements OnInit {

  @Input( "plant" ) plant : Plant;

  currentView = "data";
  plantData : PlantDataObj;
  sensors : Sensor[] = [];

  constructor(
    private sensorService : SensorService,
    private actionService : ActionService,
    private alertService : AlertService
  ) { }

  ngOnInit() {

    this.plantData = new PlantDataObj(this.plant.currentData);

    this.sensorService.getSensorsByPlantId(this.plant.id).subscribe( sensors => {

      this.sensors = sensors;

    }, err => {

      this.alertService.warning("Sensor API Error.", "There was an issue getting the sensor data, please try again in a few minutes.", 4500);

    })
  }

  updateCurrentPlantData(){
    this.actionService.updatePlantCurrentData(this.plant.id).subscribe( updatedPlant => {

      this.plantData = new PlantDataObj(updatedPlant.currentData);
      this.alertService.success("Success!",`The data of \"${this.plant.name}\" was updated.`)

    }, err => {
       
      this.alertService.warning("Update Failed.", "Please try again in a few minutes.", 4500);

    })
  }

  updateView(view : string){

    this.currentView = view;

  }

  sensorStateClass( sensor : Sensor):string{
    var states = [
      'unknown',
      'paused',
      'active'
    ]
    return "sensor-state " + states[sensor.state];
  }

  sensorStateTooltip(sensor : Sensor){
    var states = [
      'Unknown',
      'Paused',
      'Active'
    ]
    return `Status: ${states[sensor.state]}`;
  }

  sensorTypeTooltip(sensor : Sensor){
    var types = {
      10 : "Air Temperature",
      11 : "Air Humidity",
      20 : "Soil Moisture",
      21 : "Soil Temperature",
      30 : "Light Intensity",
      40 : "Watering Trigger"
    }
    return `Type: ${types[sensor.type]}`;
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
