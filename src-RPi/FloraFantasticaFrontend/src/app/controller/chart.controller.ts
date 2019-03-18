import { ElementRef } from "@angular/core";
import { Chart, ChartOptions, ChartDataSets, ChartYAxe, ChartPoint, } from 'chart.js';
import { Sensor } from "../models/sensor.model";
import { v4 as uuid } from "uuid";

export class ChartController {

  chart : Chart;

  context : CanvasRenderingContext2D;

  chartOptions : ChartOptions;
  datasets : ChartDataSets[];

  lineColors : string[];
  cLineColorIndex : number;

  constructor(eleRef : ElementRef){

    this.context = eleRef.nativeElement.getContext("2d");

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
      tooltips : {
        callbacks : {
          label : (tooltipItem, data) => {
            
            var setIndex = tooltipItem.datasetIndex;
            var label = data.datasets[setIndex].label;
            var sensorType = Sensor.labelToType(label);
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
      }
    }

    this.datasets = [];

  }

  addDataset( dataset : ChartDataSets, sensorType : number): void{


    var max = (<ChartPoint>dataset.data[0]).y;

    for(var point of dataset.data){

      point = <ChartPoint>point;
      max = point.y > max ? point.y : max;

    }

    max = <number>max;

    var yAxis = this.setupYAxis(sensorType, max);

    dataset.label = Sensor.typeToLabel(sensorType);
    dataset.borderColor = this.lineColors[this.cLineColorIndex];
    dataset.fill = false;
    dataset.yAxisID = yAxis.id;

    this.datasets.push(dataset);
    this.chartOptions.scales.yAxes.push(yAxis)

    this.cLineColorIndex++;


  }

  draw(type : string): Chart{
    
    this.chart = new Chart( this.context, {
      type : type,
      data : {
        datasets : this.datasets
      },
      options : this.chartOptions
    });

    return this.chart;
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
      31: {
        min: 0,
        max: max * 1.2 - (max * 1.2 % 100)
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

}