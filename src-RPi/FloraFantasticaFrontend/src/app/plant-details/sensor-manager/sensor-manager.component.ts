import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Sensor } from 'src/app/models/sensor.model';
import { SensorService } from 'src/app/services/sensor.service';

import { PromptService } from 'src/app/services/prompt.service';
import { AlertService } from 'src/app/services/alert.service';
import { Plant } from 'src/app/models/plant.model';

@Component({
  selector: 'app-sensor-manager',
  templateUrl: './sensor-manager.component.html',
  styleUrls: ['./sensor-manager.component.scss']
})
export class SensorManagerComponent implements OnInit {

  @Output() change = new EventEmitter<Sensor[]>();
  @Input() plant : Plant;

  activeSensors : Sensor[] = [];
  availableSensors : Sensor[] = [];

  constructor(
    private sensorService : SensorService,
    private promptService : PromptService,
    private alertService : AlertService
  ) { }

  stateToIcon( state : number ){
    var icons = [
      ['far','question-circle'],
      ['far','pause-circle'],
      ['far','play-circle'],
    ]
    return icons[state];
  }

  sensorStateTooltip(sensor : Sensor){
    var state = sensor.state;
    return `Status: ${Sensor.stateToString(state)}`;
  }

  sensorTypeTooltip(sensor : Sensor){
    var label = Sensor.typeToLabel(sensor.type);
    return `Type: ${label}`;
  }

  ngOnInit() {
    this.sensorService.getSensors().subscribe( sensors => {
      sensors.forEach( sensor => {
        if (sensor.currentPlantId === this.plant.id){
          this.activeSensors.push(sensor)
        } else if(sensor.currentPlantId == null){
          this.availableSensors.push(sensor);
        }
      });
    });
  }

  deleteSensor(deleteSensor : Sensor){
    this.promptService.confirmDelete(`Are you sure you wish to delete the sensor '${deleteSensor.name}' permanently?`, () => {
      this.sensorService.deleteSensor(deleteSensor.id).subscribe( result => {
        this.alertService.success("Success.", `Deleted the sensor '${result.name}'`);
        this.availableSensors = this.availableSensors.filter( sensor => sensor.id !== deleteSensor.id);
      }, err => {
        this.alertService.warning("Sensor API Error.", `Failed to delete the sensor '${deleteSensor.name}', please try again in a moment.`, 5000);
      })
    });
  }

  unlinkSensor(unlinkSensor : Sensor){
    this.sensorService.patchSensor(unlinkSensor.id, {
      currentPlantId: null
    }).subscribe( result => {
      this.alertService.success("Success.", `Unlinked the sensor '${result.name}'`);
      for(var i =0; i < this.activeSensors.length; i++){
        if(this.activeSensors[i].id === result.id){
          this.availableSensors.push(this.activeSensors[i]);
          this.activeSensors.splice(i,1);
        }
      }
    }, err => {
      this.alertService.warning("Sensor API Error.", `Failed to unlink the sensor '${unlinkSensor.name}', please try again in a moment.`, 5000);
    })
  }

  linkSensor(unlinkSensor : Sensor){
    this.sensorService.patchSensor(unlinkSensor.id, {
      currentPlantId: this.plant.id
    }).subscribe( result => {
      this.alertService.success("Success.", `Linked the sensor '${result.name}'`);
      for(var i =0; i < this.availableSensors.length; i++){
        if(this.availableSensors[i].id === result.id){
          this.activeSensors.push(this.availableSensors[i]);
          this.availableSensors.splice(i,1);
        }
      }
    }, err => {
      this.alertService.warning("Sensor API Error.", `Failed to link the sensor '${unlinkSensor.name}', please try again in a moment.`, 5000);
    })
  }

  resumeSensor(resumeSensor : Sensor){
    this.sensorService.patchSensor(resumeSensor.id, {
      state: 2
    }).subscribe( result => {
      this.alertService.success("Success.", `Resumed the sensor '${result.name}'`);
      this.activeSensors = this.activeSensors.map( sensor => {
        sensor.state = sensor.id !== result.id ? sensor.state : result.state
        return sensor
      });
    }, err => {
      this.alertService.warning("Sensor API Error.", `Failed to resume the sensor '${resumeSensor.name}', please try again in a moment.`, 5000);
    })
  }

  pauseSensor(pauseSensor : Sensor){
    this.sensorService.patchSensor(pauseSensor.id, {
      state: 1
    }).subscribe( result => {
      this.alertService.success("Success.", `Resumed the sensor '${result.name}'`);
      this.activeSensors = this.activeSensors.map( sensor => {
        sensor.state = sensor.id !== result.id ? sensor.state : result.state;
        return sensor
      });
    }, err => {
      this.alertService.warning("Sensor API Error.", `Failed to pause the sensor '${pauseSensor.name}', please try again in a moment.`, 5000);
    })
  }

}
