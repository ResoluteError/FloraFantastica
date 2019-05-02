import { Component, OnInit, Input } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { Plant } from 'src/app/models/plant.model';
import { Action, ActionState } from 'src/app/models/action.model';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-watering',
  templateUrl: './watering.component.html',
  styleUrls: ['./watering.component.scss']
})
export class WateringComponent implements OnInit {

  @Input() plant : Plant;

  inputDuration : string = "30";

  actionState : ActionState = ActionState.unsubmitted;

  constructor(
    private actionService : ActionService,
    private alertService : AlertService
  ) { }

  ngOnInit() {
  }

  startWatering(){

    this.actionState = ActionState.queued;

    this.actionService.manualWatering(38, 5000, this.plant.id).subscribe( result => {
      this.actionState = result.state;

      if(this.actionState === ActionState.queued){

        this.actionService.pingActionState(result.id).subscribe( result => {

          this.actionState = result.state;

        }, err => {

          if(err.state){

            this.actionState = err.state || -1;

          }
        });

    }

  }, err => {

    this.alertService.warning("Action API Error!", "Failed submitting action request, please try again in a moment.");

  });

  }

  reset(){
    this.actionState = ActionState.unsubmitted;
  }

  get isUnsubmitted(): boolean{
    return this.actionState === ActionState.unsubmitted;
  }

  get isQueued(): boolean{
    return this.actionState === ActionState.queued;
  }

  get isError(): boolean{
    return this.actionState === ActionState.error;
  }

  get isCompleted(): boolean{
    return this.actionState === ActionState.completed;
  }

}
