import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlantService } from '../services/plant.service';
import { MeasurementService } from '../services/measurement.service';
import { SensorService } from '../services/sensor.service';
import { Plant, PlantDataToIterable } from '../models/plant.model';
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
  @ViewChild("editForm") editForm: ElementRef;

  plant : Plant;
  chart : Chart;
  timeScope: number = 1;
  chartController : ChartController;
  chartUIController : ChartUIController;
  sensors : Sensor[];
  editMode: boolean = false;
  saving: boolean = false;
  editPlant: Plant;

  plantDataIter : string[][];

  ngOnInit() {

    var plantId = this.route.snapshot.params.plantId;

    this.plantService.getPlantById(plantId).subscribe( plant => {
      this.plant = plant;
      this.plantDataIter = PlantDataToIterable(plant.currentData);
    }, err => {
      this.alertService.warning("Plant API Error.","Failed getting plant data for the plant "+ plantId);
    });

    var requests = combineLatest(
      this.measurementService.getMeasurementsByPlantId(plantId),
      this.sensorService.getSensorsByPlantId(plantId),
      this.sensorService.getAvailableSensors()
    );

    requests.subscribe( ([measurements, plantSensors, availableSensors]) => {

      var sensors = plantSensors.concat(availableSensors).map( sensor =>
        Sensor.toDisplaySensor(sensor, [this.plant])
      )
      this.sensors = sensors;
      
      this.handleMeasurementImport(measurements, sensors);
    }, err => {
      this.alertService.warning("Measurement or Sensor API Error.","Failed getting measurement data for the plant "+ plantId);
    }, () => {
      console.log("Requests completed");
    });

  }


  handleMeasurementImport(measurements : Measurement[], sensors : Sensor[]): void{

    var chartController = new ChartController(this.baseChart);

    chartController.setupXAxis(this.timeScope);

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

    this.chart = chartController.draw("scatter");

    var chartUIController = new ChartUIController(this.chartUI);
    chartUIController.fitToChart(this.baseChart);

    chartController.setUIDelegate(
      chartUIController.actionHandler
    )

    this.chartController = chartController;
    this.chartUIController = chartUIController;

  }

  handleNewMeasurement( measurement : Measurement): void {
    this.chartController.addMeasurementToDataset(measurement);
  }

  updateChartScope( days : number){
    this.timeScope = days;
    this.chartController.setupXAxis(days);
  }

  newHealthEntry( entry : Measurement){
    if(this.chartController.sensors.findIndex( sensor => sensor.id === entry.sensorId) > -1){
      this.chartController.addMeasurementToDataset(
        entry
      );
    } else {
      this.sensorService.getSensorById( entry.sensorId).subscribe(sensor => {
        var dataset = {
          data : [{
            x: new Date(entry.measuredAt),
            y: entry.data
          }],
          showLine: (entry.sensorType !== 40),
          lineTension: 0
        }
        
        this.chartController.addDataset(dataset, sensor);
        this.chart = this.chartController.draw("scatter");
      });
    }
  }

  activeClass( days : number){
    return this.timeScope === days ? "active" : "";
  }

  toggleEdit( editMode : boolean){
    if(editMode){
      this.editPlant = this.plant;
    }
    this.editMode = true;
  }

  quitEdit( save: boolean){
    if(save){
      this.saving = true;
      var form = this.editForm.nativeElement;
      var formData = new FormData(form);
      try {
        var imgSize = formData.get("plantImageUpload")["size"];
        if(imgSize === 0){
          formData.delete("plantImageUpload");
        }
      } catch {

      }
      this.plantService.patchPlantForm(this.plant.id, formData).subscribe( result => {
        this.plant.name = result.name;
        this.plant.icon = result.icon;
        this.plant.description = result.description;
        this.editMode = false;
      }, err => {

        if(err.status == 403){
          this.alertService.accessDenied();
        } else {
          this.alertService.warning("Plant API Error.", "Failed saving plant details, please try again in a moment.");
        }
      
      }, () => {
        this.saving = false;
      });
    } else {
      this.editMode = false;
    }
  }

  updateIconStr( event : Event ){
    this.editPlant.icon = event.srcElement["value"];
  }

}
