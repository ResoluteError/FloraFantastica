import { Component, OnInit } from '@angular/core';
import { PlantService } from '../services/plant.service';
import { MeasurementService } from '../services/measurement.service';
import { SensorService } from '../services/sensor.service';
import { Plant } from '../models/plant.model';
import { Sensor } from '../models/sensor.model';
import { Measurement } from '../models/measurement.model';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(
    private plantService : PlantService,
    private measurementService : MeasurementService,
    private sensorService : SensorService,
    private alertService : AlertService,
    private route : ActivatedRoute
  ) { }

  plant : Plant;
  sensors : Sensor[];
  measurements : Measurement[];

  ngOnInit() {

    var plantId = this.route.snapshot.params.plantId;

    this.plantService.getPlantById(plantId).subscribe( plant => {
      this.plant = plant;
    }, err => {
      this.alertService.warning("Plant API Error.","Failed getting plant data for the plant "+ plantId);
    });

    this.measurementService.getMeasurementsByPlantId(plantId).subscribe( measurements => {
      this.measurements = measurements;
    }, err => {
      this.alertService.warning("Measurement API Error.","Failed getting measurement data for the plant "+ plantId);
    });

    this.sensorService.getSensorsByPlantId(plantId).subscribe( sensors => {
      this.sensors = sensors;
    }, err => {
      this.alertService.warning("Sensor API Error.","Failed getting sensor data for the plant "+ plantId);
    });

  }

}
