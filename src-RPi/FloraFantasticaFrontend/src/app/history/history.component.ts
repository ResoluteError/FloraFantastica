import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlantService } from '../services/plant.service';
import { MeasurementService } from '../services/measurement.service';
import { SensorService } from '../services/sensor.service';
import { Plant } from '../models/plant.model';
import { Sensor } from '../models/sensor.model';
import { Measurement } from '../models/measurement.model';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { Chart} from 'chart.js';
import { ChartController } from '../controller/chart.controller';
import { ChartUIController } from '../controller/chartUI.controller';

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

  @ViewChild("baseChart") baseChart : ElementRef;
  @ViewChild("chartUI") chartUI : ElementRef;

  plant : Plant;
  sensors : Sensor[];
  measurements : Measurement[];
  chart : Chart;

  ngOnInit() {

    var plantId = this.route.snapshot.params.plantId;

    this.plantService.getPlantById(plantId).subscribe( plant => {
      this.plant = plant;
    }, err => {
      this.alertService.warning("Plant API Error.","Failed getting plant data for the plant "+ plantId);
    });

    this.measurementService.getMeasurementsByPlantId(plantId).subscribe( measurements => {
      this.measurements = Measurement.sortByDate(measurements);
      this.handleMeasurementImport(measurements);
    }, err => {
      this.alertService.warning("Measurement API Error.","Failed getting measurement data for the plant "+ plantId);
    });

    this.sensorService.getSensorsByPlantId(plantId).subscribe( sensors => {
      this.sensors = sensors;
    }, err => {
      this.alertService.warning("Sensor API Error.","Failed getting sensor data for the plant "+ plantId);
    });

  }


  handleMeasurementImport(measurements : Measurement[]){

    var sensors = Measurement.getDistinctSensors(measurements);
    var chartController = new ChartController(this.baseChart);

    // Get a temperature Sensor
    var exampleSensor = sensors.find(value => value.type == 21 || value.type == 10);

    var data = measurements.filter( measurement => measurement.sensorId == exampleSensor.id).map( measurement => {
      return {
        x : new Date(measurement.measuredAt),
        y : measurement.data
      }
    });

    var dataset = {
      data : data,
      showLine: true,
      lineTension: 0
    }

    chartController.addDataset(dataset, exampleSensor.type);
    
    // Get a temperature Sensor
    var exampleSensor = sensors.find(value => value.type == 20 || value.type == 11);

    var data = measurements.filter( measurement => measurement.sensorId == exampleSensor.id).map( measurement => {
      return {
        x : new Date(measurement.measuredAt),
        y : measurement.data
      }
    });

    var dataset = {
      data : data,
      showLine: true,
      lineTension: 0
    }

    chartController.addDataset(dataset, exampleSensor.type);

    this.chart = chartController.draw("scatter");


    var chartUIController = new ChartUIController(this.chartUI);
    chartUIController.fitToChart(this.baseChart);


    chartController.setUIDelegate(
      chartUIController.actionHandler
    )

  }

  hanldeUI( ){


  }

}
