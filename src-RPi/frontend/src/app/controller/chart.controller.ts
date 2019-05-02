import { ElementRef } from "@angular/core";
import { Chart, ChartOptions, ChartDataSets, ChartYAxe, ChartPoint, } from 'chart.js';
import { Sensor } from "../models/sensor.model";
import { v4 as uuid } from "uuid";
import { Measurement } from "../models/measurement.model";

export class ChartController {

  private chart : Chart;

  canvas : HTMLCanvasElement;
  context : CanvasRenderingContext2D;

  sensors : Sensor[];

  private chartOptions : ChartOptions;
  private datasets : ChartDataSets[];

  lineColors : string[];
  cLineColorIndex : number;
  lineColorsByType : {[index: string]: string};

  constructor(eleRef : ElementRef){

    this.canvas = eleRef.nativeElement;
    this.context = this.canvas.getContext("2d");
    this.sensors = [];

    this.lineColorsByType = {
      10 : "rgba(255, 120, 120, 1)",
      11 : "rgba(0, 200, 255, 1)",
      20 : "rgba(220, 0, 250, 1)",
      21 : "rgba(180, 75, 0, 1)",
      30 : "rgba(255, 225, 0, 1)",
      40 : "rgba(0,25,160,1)",
      90 : "rgba(10,180,80,1)"
    }

    this.chartOptions = {
      legend: {
        labels : {
          //usePointStyle: true,
          fontSize: 15,
          padding: 15
        },
        position: "right",
      },
      tooltips : {
        callbacks : {
          label : (tooltipItem, data) => {
            var setIndex = tooltipItem.datasetIndex;
            var sensorType = this.sensors[setIndex].type;
            var date = (new Date(tooltipItem.xLabel)).toLocaleTimeString();
            var units = Sensor.typeToUnit(sensorType);
            return `[${date}] ${Sensor.typeToLabel(sensorType)}: ${tooltipItem.yLabel + units}`;

          }
          
        }
      },
      scales : {
        xAxes : [{
          id: uuid(),
          ticks: {
            beginAtZero : false,
            callback : (value) => {
              return (new Date(value)).toLocaleDateString();
            }
          }
        }],
        yAxes : [{
          ticks: {
            min : 0,
            max: 100,
            display: false
          }
        }]
      },
      responsive: true
    }

    this.datasets = [];

  }

  addDataset( dataset : ChartDataSets, sensor : Sensor): void{

    try {
      var max = (<ChartPoint>dataset.data[0]).y;
      var min = (<ChartPoint>dataset.data[0]).y;
  
      for(var point of dataset.data){
  
        point = <ChartPoint>point;
        max = point.y > max ? point.y : max;
        min = point.y < min ? point.y : min;
  
      }
  
      max = <number>max;
      min = <number>min;
  
      var yAxis = this.setupYAxis(sensor.type, min, max);
  
      dataset.label = sensor.name;
      dataset.borderColor = this.lineColorsByType[sensor.type];
      dataset.backgroundColor = "transparent";
      dataset.fill = false;
      dataset.yAxisID = yAxis.id;
      dataset.pointStyle = "circle";
  
      this.datasets.push(dataset);
      this.sensors.push(sensor);
      this.chartOptions.scales.yAxes.push(yAxis)
  
      this.cLineColorIndex++;
    } catch {
      // empty dataset
    }

  }

  draw(type : string): Chart{
    
    var chartData = {
      type : type,
      data : {
        datasets : this.datasets
      },
      options : this.chartOptions
    };

    this.chart = new Chart(this.context, chartData );

    return this.chart;
  }

  public setupXAxis( timeScope: number): void{

    var now = Date.now();
    var msInHour = 1000 * 60 * 60;    
    var msInDay = msInHour * 24;    
    var endOfToday = now + ( msInDay - (now % msInDay))
    var endOfHour = Math.ceil(Date.now() / msInHour) * msInHour;
    var stepSize : number;

    this.chartOptions.scales.xAxes[0].ticks.min = endOfToday - timeScope * msInDay;
    this.chartOptions.scales.xAxes[0].ticks.max = endOfToday;

    if(timeScope <= 1){
      stepSize = msInHour * 2;
      this.chartOptions.scales.xAxes[0].ticks.min = endOfHour - msInDay;
      this.chartOptions.scales.xAxes[0].ticks.max = endOfHour;
    } else if(timeScope <= 7){
      stepSize = msInDay;
    } else {
      stepSize = msInDay * Math.round(timeScope / 10);
    }

    this.chartOptions.scales.xAxes[0].ticks.stepSize = stepSize;

    if(timeScope <= 1){
      this.chartOptions.scales.xAxes[0].ticks.callback = (value) => {
        return (new Date(value)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      }
    } else {
      this.chartOptions.scales.xAxes[0].ticks.callback = (value) => {
        return (new Date(value)).toLocaleDateString();
      }
    }

    if(this.chart){
      this.chart.config.options.scales.xAxes = this.chartOptions.scales.xAxes;
      this.chart.update();
      return;
    }

  }

  public addMeasurementToDataset( measurement : Measurement){

    for( var i = 0; i < this.sensors.length; i++){
      var sensor = this.sensors[i];
      if(sensor.id === measurement.sensorId){
        var newPoint : ChartPoint = {
          x : new Date(measurement.measuredAt),
          y : measurement.data
        };
        (<ChartPoint[]>this.datasets[i].data).push(newPoint);
        if(this.chart){
          this.chart.data.datasets = this.datasets;
          this.chart.update();
        }
        return;
      }
    }
  }

  
  private setupYAxis(sensorType: number, min: number, max : number) : ChartYAxe {
    var id = uuid();

    var ticks;

    switch(sensorType){

      case 90: {
        ticks = {
          min: -20,
          max: 80
        }
      }

      default : {
        ticks = {
          min: min - (max - min) * .1,
          max: max + (max - min) * .1
        };
      } 

    }

    var yAxis = {
      id : id,
      label : Sensor.typeToLabel(sensorType),
      type : "linear",
      ticks : ticks,
      display : false
    }
    return yAxis;
  }

  setUIDelegate( delegate? : Function){
    
    this.canvas.onclick = (event) => {
      delegate( this.chart.getElementsAtEvent(event), event);

    }
    
  }

}