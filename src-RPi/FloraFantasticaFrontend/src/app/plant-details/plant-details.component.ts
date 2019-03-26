import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlantService } from '../services/plant.service';
import { MeasurementService } from '../services/measurement.service';
import { SensorService } from '../services/sensor.service';
import { Plant } from '../models/plant.model';
import { Sensor } from '../models/sensor.model';
import { Measurement } from '../models/measurement.model';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { ChartController } from '../controller/chart.controller';
import { ChartUIController } from '../controller/chartUI.controller';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-plant-details',
  templateUrl: './plant-details.component.html',
  styleUrls: ['./plant-details.component.scss']
})
export class PlantDetailsComponent implements OnInit {

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
  chart : Chart;
  timeScope: number = 30;
  chartController : ChartController;
  chartUIController : ChartUIController;
  sensors : Sensor[];

  ngOnInit() {

    var plantId = this.route.snapshot.params.plantId;

    this.plantService.getPlantById(plantId).subscribe( plant => {
      this.plant = plant;
    }, err => {
      this.alertService.warning("Plant API Error.","Failed getting plant data for the plant "+ plantId);
    });

    var requests = combineLatest(
      this.measurementService.getMeasurementsByPlantId(plantId),
      this.sensorService.getSensorsByPlantId(plantId),
      this.sensorService.getAvailableSensors()
    );

    requests.subscribe( ([measurements, plantSensors, availableSensors]) => {

      console.log("availableSensors: ", availableSensors);

      var sensors = plantSensors.concat(availableSensors).map( sensor =>
        Sensor.toDisplaySensor(sensor, [this.plant])
      )
      this.handleMeasurementImport(measurements, sensors);
    }, err => {
      this.alertService.warning("Measurement or Sensor API Error.","Failed getting measurement data for the plant "+ plantId);
    });

  }


  handleMeasurementImport(measurements : Measurement[], sensors : Sensor[]): void{

    var chartController = new ChartController(this.baseChart);

    if(measurements.length === 0){
      chartController.draw("scatter");
      return;
    }
  
    Measurement.sortByDate(measurements);

    for(var sensor of sensors){
      var data = measurements.filter( measurement => measurement.sensorId == sensor.id).map( measurement => {
        return {
          x : new Date(measurement.measuredAt),
          y : measurement.data
        }
      });

      var dataset = {
        data : data,
        showLine: (sensor.type !== 40),
        lineTension: 0
      }

      chartController.addDataset(dataset, sensor);

    }

    chartController.setupXAxis(this.timeScope);

    this.chart = chartController.draw("scatter");

    var chartUIController = new ChartUIController(this.chartUI);
    chartUIController.fitToChart(this.baseChart);

    chartController.setUIDelegate(
      chartUIController.actionHandler
    )

    this.chartController = chartController;
    this.chartUIController = chartUIController;

  }

  updateChartScope( days : number){
    this.timeScope = days;
    this.chartController.setupXAxis(days);
  }

  newHealthEntry( entry : Measurement){
    this.chartController.addMeasurementToDataset(
      entry
    );
  }

  activeClass( days : number){
    return this.timeScope === days ? "active" : "";
  }

}
