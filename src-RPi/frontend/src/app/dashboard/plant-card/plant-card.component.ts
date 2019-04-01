import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Plant, PlantDataObj } from 'src/app/models/plant.model';
import { SensorService } from 'src/app/services/sensor.service';
import { Sensor, DisplaySensor } from 'src/app/models/sensor.model';
import { ActionService } from 'src/app/services/action.service';
import { AlertService } from 'src/app/services/alert.service';
import { PromptService } from 'src/app/services/prompt.service';
import { PlantService } from 'src/app/services/plant.service';

@Component({
  selector: 'app-plant-card',
  templateUrl: './plant-card.component.html',
  styleUrls: ['./plant-card.component.scss']
})
export class PlantCardComponent implements OnInit {

  @Input( "plant" ) plant : Plant;
  @Input() sensors: DisplaySensor[];
  @Output() delete = new EventEmitter<string>();


  currentView = "data";
  plantData : PlantDataObj;

  constructor(
    private sensorService : SensorService,
    private plantService : PlantService,
    private actionService : ActionService,
    private alertService : AlertService,
    private promptService: PromptService
  ) { }

  ngOnInit() {
    this.plantData = new PlantDataObj(this.plant.currentData);
    this.sensors = this.sensors.filter( sensor => sensor.currentPlantId === this.plant.id);
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

  sensorStateTooltip(sensor : Sensor){
    var state = sensor.state;
    return `Status: ${Sensor.stateToString(state)}`;
  }

  sensorTypeTooltip(sensor : Sensor){
    var label = Sensor.typeToLabel(sensor.type);
    return `Type: ${label}`;
  }

  deletePlant(){
    this.promptService.confirmDelete(`Are you sure you want to permanently delete '${this.plant.name}'?`, ()=>{

      this.plantService.deletePlant(this.plant.id).subscribe( result =>{

        var sensorRequestCounter = 0;
        var failed = [];

        if(this.sensors.length === 0){
          this.delete.emit(this.plant.id);
          this.alertService.success("Success.", `The plant '${this.plant.name}' was deleted.`);
          return;
        }

        this.sensors.forEach( (sensor) => {
          this.sensorService.patchSensor(sensor.id, {
            currentPlantId: null
          }).subscribe( result => {
            console.log("Unlinked Sensor: " + result.id);
          }, err => {
            console.log("Failed unlinking sensor: " + sensor.id);
            failed.push(sensor.name);
          }, () => {
            sensorRequestCounter++;
            if(sensorRequestCounter === this.sensors.length){
              this.delete.emit(this.plant.id);
              if(failed.length === 0){
                this.alertService.success("Deletion Successfull!", "All sensors of that plant were unlinked.")
              } else {
                this.alertService.warning("Sensor API Error!", "Plant could be deleted, but these sensors were not unlinked: " + failed.join(", "), 5000)
              }
            }
          });
        });
      }, err => {
        this.alertService.warning('Plant API Error.',`Could not delete '${this.plant.name}', please try again in a moment.`)
      });

    });
  }

  get noPlantData(){
    for(var key in this.plantData){
      if(this.plantData[key] != null){
        return false;
      }
    }
    return true;
  }

}
