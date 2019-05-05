import { Component, OnInit } from '@angular/core';
import { PlantService } from '../services/plant.service';
import { Plant } from '../models/plant.model';
import { AlertService } from '../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { Sensor, DisplaySensor } from '../models/sensor.model';
import { SensorService } from '../services/sensor.service';
import { Location } from '@angular/common';
import { combineLatest } from 'rxjs';
import { Table } from '../helper/table/Table';

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
  sensors : DisplaySensor[] = [];
  view : string;
  sensorTable : Table = new Table([]);

  loggedIn : boolean;


  ngOnInit() {

    this.loggedIn = localStorage.getItem("auth") != null;

    this.view = this.route.snapshot.data.view;

    var subs = [
      this.sensorService.getSensors(),
      this.plantService.getPlants()
    ];

    var combined = combineLatest( subs, (sensors : Sensor[], plants : Plant[]) => {

      var dispSensors: DisplaySensor[] = [];

      sensors.forEach( sensor => {
        if(sensor.type >= 90){
          return
        }
        dispSensors.push(Sensor.toDisplaySensor(sensor, plants));
      });
      
      return [dispSensors, plants];

    });

    combined.subscribe( ([sensors, plants]) => {

      this.sensors = <DisplaySensor[]>sensors;
      this.sensorTable = new Table(this.sensors);
      this.plants = <Plant[]>plants;

    }, err => {

      if(err.status == 403){
        this.alertService.accessDenied();
      } else {
        this.alertService.warning("Sensor API Error.","Failed fetching sensor data. Please try again in a moment.", 4000)
      }

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
    this.sensors.push(Sensor.toDisplaySensor(sensor, this.plants));
    this.sensorTable.updateData(this.sensors);
  }

  typeToStr( type : number){
    return Sensor.typeToLabel(type);
  }

}
