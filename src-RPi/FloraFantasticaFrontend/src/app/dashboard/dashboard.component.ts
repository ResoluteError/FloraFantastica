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
  sortSetting : {item : string, desc: boolean} = {
    item : null,
    desc : null
  }

  ngOnInit() {

    this.view = this.route.snapshot.data.view;

    this.sensorService.getSensors().subscribe( sensors => {

      this.sensors = sensors.filter(sensor => sensor.type < 90);

    }, err => {

      this.alertService.warning("Sensor API Error.","Failed fetching sensor data. Please try again in a moment.", 4000)

    });

    this.plantService.getPlants().subscribe( plants => {

      this.plants = plants;

    }, err => {

      this.alertService.warning("Plant API Error.","Failed fetching data for plants. Please try again in a moment.", 4000)

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
    switch(this.sortSetting.item){
      case 'type': 
        this.sortSensors(this.typeToStr);
        break;
      case 'currentPlantId': 
        this.sortSensors(this.plantIdToStr);
        break;
      default:
        this.sortSensors();
        break;
    }
  }

  typeToStr( type : number){
    return Sensor.typeToLabel(type);
  }

  plantIdToStr( id : string){
    var plant = this.plants.find(plant => plant.id === id)
    return plant ? plant.name : "";
  }

  toggleSort(item: string, pipeData? : Function){
    if(this.sortSetting.desc && this.sortSetting.item === item){
      this.sortSetting.desc = false;
    } else {
      this.sortSetting.desc = true;
      this.sortSetting.item = item;
    }
    this.sortSensors(pipeData);
  }

  // Custom Sorting just for fun
  sortSensors(pipeData? : Function){
    var item = this.sortSetting.item;
    if(this.sortSetting.desc){
      this.sensors = this.sensors.sort( (a, b)=> {
        var aData = a[item];
        var bData = b[item];
        if(pipeData){
          aData = pipeData.call(this, aData) 
          bData = pipeData.call(this, bData) 
        }
        if(typeof aData === "string" || typeof bData === "string"){
          aData = aData || '';
          bData = bData || '';
          return aData.localeCompare(bData);
        } else {
          return aData - bData;
        }
      });
    } else {
      this.sensors.sort( (a, b)=> {
        var aData = a[item];
        var bData = b[item];
        if(pipeData){
          aData = pipeData.call(this, aData) 
          bData = pipeData.call(this, bData) 
        }
        if(typeof aData === "string" || typeof bData === "string"){
          aData = aData || '';
          bData = bData || '';
          return bData.localeCompare(aData);
        } else {
          return bData - aData;
        }
        
      });
    }
  }

  getSortIcon(item : string){
    if(item === this.sortSetting.item){
      return this.sortSetting.desc ? ['fas','caret-down'] : ['fas','caret-up'];
    } 
    return null;
  }

}
