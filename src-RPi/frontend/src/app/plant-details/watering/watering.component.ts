import { Component, OnInit, Input } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { Plant } from 'src/app/models/plant.model';
import { Action } from 'src/app/models/action.model';

@Component({
  selector: 'app-watering',
  templateUrl: './watering.component.html',
  styleUrls: ['./watering.component.scss']
})
export class WateringComponent implements OnInit {

  @Input() plant : Plant;

  state : number = -3;

  constructor(
    private actionService : ActionService
  ) { }

  ngOnInit() {
  }

  water(){

    this.actionService.manualWatering(38, 5000, this.plant.id).subscribe( result => {
      
      this.state = result.state;

      if(this.state === 0){

        this.actionService.pingActionState(result.id).subscribe( result => {
          this.state = result.state;
        }, err => {
          if(err.state){
            this.state = err.state;
          } else {
            this.state = -2;
          }
        }, () => {
          console.log("PING completed");  
        })

      }

    }, err => {
      console.log("Test Err: ", err);
    });

  }


}
