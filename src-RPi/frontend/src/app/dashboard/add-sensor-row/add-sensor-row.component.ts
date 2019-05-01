import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Sensor } from 'src/app/models/sensor.model';
import { Plant } from 'src/app/models/plant.model';
import { AlertService } from 'src/app/services/alert.service';
import { SensorService } from 'src/app/services/sensor.service';

@Component({
  selector: '[add-sensor-row]',
  templateUrl: './add-sensor-row.component.html',
  styleUrls: ['./add-sensor-row.component.scss']
})
export class AddSensorRowComponent implements OnInit {

  @Output() create = new EventEmitter<Sensor>()
  @Input() plants : Plant[];
  sensor : Partial<Sensor>;

  constructor(
    private alertService: AlertService,
    private sensorService: SensorService
  ) { }

  ngOnInit() {
    this.resetFormData();
  }

  resetFormData(){
    this.sensor = {
      state: 0,
      name : null,
      currentPlantId: null,
      type: null,
      powerPin: null,
      dataPin: null
    }
  }

  createSensor(){
    // Todo form validation
    this.sensorService.postSensor(this.sensor).subscribe( result => {
      this.create.emit(result);
      this.resetFormData();
      this.alertService.success("Success.",`Created the sensor '${result.name}'.`);
    }, err => {
      this.alertService.warning("Sensor API Error.", `Failed creating the sensor '${this.sensor.name}', please try again in a few minutes.`);
    })
  }

}
