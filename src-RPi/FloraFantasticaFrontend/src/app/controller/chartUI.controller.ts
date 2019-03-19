import { ElementRef } from "@angular/core";

export class ChartUIController {

  canvas : HTMLCanvasElement;
  ctx : CanvasRenderingContext2D;

  constructor(eleRef : ElementRef){
    this.canvas = eleRef.nativeElement
    this.ctx = this.canvas.getContext("2d");

  }

  fitToChart( chart : ElementRef): void{
    var htmlEle = <HTMLCanvasElement>chart.nativeElement;
    var height = htmlEle.clientHeight;
    var width = htmlEle.clientWidth;
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
  }

  actionHandler( datasets : any, event : MouseEvent ){
    console.log("acitonhandler: datasets, event - ", datasets, event);
  }

}