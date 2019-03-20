import { Component, OnInit } from '@angular/core';
import { PlantService } from '../services/plant.service';
import { Plant } from '../models/plant.model';
import { AlertService } from '../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { Sensor } from '../models/sensor.model';
import { SensorService } from '../services/sensor.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private plantService : PlantService,
    private sensorService : SensorService,
    private alertService : AlertService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  plants : Plant[] = [];
  sensors : Sensor[] = [];
  view : string;

  ngOnInit() {

    this.view = this.route.snapshot.data.view;

    this.sensorService.getSensors().subscribe( sensors => {

      this.sensors = sensors;

    }, err => {

      this.alertService.warning("Sensor API Error.","Faield fetching sensor data. Please try again in a moment.", 4000)

    });

    this.plantService.getPlants().subscribe( plants => {

      this.plants = plants;

    }, err => {

      this.alertService.warning("Plant API Error.","Faield fetching data for plants. Please try again in a moment.", 4000)

    });

  }

  changeTab(path : string){
    this.location.replaceState(path);
    this.view = path.includes("sensors") ? "sensors" : "plants";
  }

  activeClass(button : string){
    if(button === this.view){
      return "active"
    } 
    return "";
  }

  removePlant( plantId : string){
    this.plants = this.plants.filter( plant => plant.id !== plantId);
  }

  removeSensor( sensorId : string){
    this.sensors = this.sensors.filter( sensor => sensor.id !== sensorId);
  }

  createPlant( plant: Plant){
    this.plants.push(plant);
  }

  createSensor(sensor: Sensor){
    this.sensors.push(sensor);
  }

}
