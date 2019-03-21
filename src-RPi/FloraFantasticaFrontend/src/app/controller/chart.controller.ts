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

  constructor(eleRef : ElementRef){

    this.canvas = eleRef.nativeElement;
    this.context = this.canvas.getContext("2d");
    this.sensors = [];

    this.lineColors = [
      "rgba(20,40,150,1)",
      "rgba(220,150,10,1)",
      "rgba(170,10,220,1)",
      "rgba(10,180,80,1)",
      "rgba(40, 90, 60, 1)",
      "rgba(90,40,40,1)"
    ];

    this.cLineColorIndex = 0;

    this.chartOptions = {
      legend: {
        labels : {
          //usePointStyle: true,
          fontSize: 15,
          padding: 15
        },
        position: "top",
      },
      tooltips : {
        callbacks : {
          label : (tooltipItem, data) => {
            var setIndex = tooltipItem.datasetIndex;
            var sensorType = this.sensors[setIndex].type;
            var date = (new Date(tooltipItem.xLabel)).toLocaleString();
            var units = Sensor.typeToUnit(sensorType);
            return `${date}: ${tooltipItem.yLabel + units}`;

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
        yAxes : []
      },
      responsive: true
    }

    this.datasets = [];

  }

  addDataset( dataset : ChartDataSets, sensor : Sensor): void{

    try {
      var max = (<ChartPoint>dataset.data[0]).y;
  
      for(var point of dataset.data){
  
        point = <ChartPoint>point;
        max = point.y > max ? point.y : max;
  
      }
  
      max = <number>max;
  
      var yAxis = this.setupYAxis(sensor.type, max);
  
      dataset.label = sensor.name;
      dataset.borderColor = this.lineColors[this.cLineColorIndex];
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

    var msInHour = 1000 * 60 * 60;    
    var msInDay = msInHour * 24;    
    var endOfToday = Date.now() + ( msInDay - (Date.now() % msInDay))

    var stepSize : number;

    this.chartOptions.scales.xAxes[0].ticks.min = endOfToday - timeScope * msInDay;
    this.chartOptions.scales.xAxes[0].ticks.max = endOfToday;

    if(timeScope <= 1){
      stepSize = msInHour * 2;
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

  
  private setupYAxis(sensorType: number, max : number) : ChartYAxe {
    var id = uuid();

    var ticksByType = {
      10: {
        min: -20,
        max: 80
      },
      11: {
        min: 0,
        max: 100
      },
      20: {
        min: 0,
        // evtl. 40000?
        max: max * 1.2 - (max * 1.2 % 10000)
      }, 
      21: {
        min: -20,
        max: 80
      },
      30: {
        min: 0,
        max: max * 1.2 - (max * 1.2 % 10)
        // evtl. 1080?
      },
      40: {
        min: 0,
        max: max * 1.2 - (max * 1.2 % 100)
      },
      90: {
        min: 0,
        max: 10
      }
    }
    var yAxis = {
      id : id,
      label : Sensor.typeToLabel(sensorType),
      type : "linear",
      ticks : ticksByType[sensorType]
    }
    return yAxis;
  }

  setUIDelegate( delegate? : Function){
    
    this.canvas.onclick = (event) => {
      console.log(event);
      delegate( this.chart.getElementsAtEvent(event), event);

    }
    
  }

}