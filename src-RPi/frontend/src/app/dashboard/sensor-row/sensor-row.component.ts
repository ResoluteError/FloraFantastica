import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Sensor, DisplaySensor } from 'src/app/models/sensor.model';
import { Plant } from 'src/app/models/plant.model';
import { SensorService } from 'src/app/services/sensor.service';
import { AlertService } from 'src/app/services/alert.service';
import { PromptService } from 'src/app/services/prompt.service';



@Component({
  selector: '[sensor-row]',
  templateUrl: './sensor-row.component.html',
  styleUrls: ['./sensor-row.component.scss']
})
export class SensorRowComponent implements OnInit {

  @Input("sensor") sensor : DisplaySensor;
  @Input("plants") plants : Plant[];

  @Output("delete") delete = new EventEmitter<string>();
  @Output("create") create = new EventEmitter<Sensor>();

  editSensor : Sensor;

  editMode : boolean;

  constructor(
    private sensorService : SensorService,
    private alertService: AlertService,
    private promptService: PromptService
  ) { }

  ngOnInit() {
    this.editMode = false;
  }

  switchMode(edit : boolean){
    if(edit){
      this.editSensor = Object.assign({},this.sensor); 
    }
    this.editMode = edit;
  }

  saveEdit(){
    this.sensorService.patchSensor(this.sensor.id, this.editSensor).subscribe( result => {
      this.sensor = Sensor.toDisplaySensor(result, this.plants);
      this.alertService.success("Success.","Sensor was updated.");
      this.editMode = false;
    }, err => {
      if(err.status == 403){
        this.alertService.accessDenied();
      } else {
        this.alertService.warning("Sensor API Error.","Could not update the sensor, please try again in a moment.");
      }
    })
  }

  deleteSensor(){
    this.promptService.confirmDelete(`Are you sure you want to permanently delete '${this.sensor.name}'?`, ()=>{
      this.sensorService.deleteSensor(this.sensor.id).subscribe( result => {
        this.delete.emit(result.id);
        this.alertService.success("Success.",`Deleted the sensor '${result.name}'`);
      }, err => {
        if(err.status == 403){
          this.alertService.accessDenied();
        } else {
          this.alertService.warning("Sensor API Error.",`Failed to delete the sensor '${this.sensor.name}', please try again in a moment.`)
        }
      })
    });
  }
  
}
