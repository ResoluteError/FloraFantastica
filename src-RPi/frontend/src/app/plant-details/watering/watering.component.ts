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

  WATERING_VALVE_PIN = 38;

  inputDuration : string = "30";
  actionState : ActionState = ActionState.unsubmitted;

  submittedAction : Action = null;

  lastWatered : Date;
  possibleTimeout : boolean = false;

  constructor(
    private actionService : ActionService,
    private alertService : AlertService
  ) { }

  ngOnInit() {
    this.actionService.getLatestActionByPlantId(this.plant.id).subscribe( result => {

      if(result.state == ActionState.queued){
        this.actionState = ActionState.queued;
        this.submittedAction = result;
        this.possibleTimeout = this.isPossibleTimeout();
      }
    }, err => {

      // Fail silently?

    })
  }

  startWatering(){

    this.actionState = ActionState.queued;

    this.actionService.manualWatering(this.WATERING_VALVE_PIN, 1000 * +this.inputDuration, this.plant.id).subscribe( result => {
      
      console.log("Warning: Manual watering is still fixed to pin 38!");

      this.submittedAction = result;

      this.actionState = result.state;

      if(this.actionState === ActionState.queued){

        this.actionService.pingActionState(result.id).subscribe( result => {

          this.actionState = result.state;
          this.possibleTimeout = this.isPossibleTimeout();

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

  cancel(){

    this.actionService.patchAction(this.submittedAction.id, {
      state : ActionState.error
    }).subscribe( result => {

      this.alertService.success("Action Canceled!", "You may now try starting another action.");
      this.actionState = ActionState.unsubmitted;
      this.submittedAction = null;

    }, err => {
      this.alertService.warning("Action API Error!", "Failed to cancel the action, please try again in a moment.")
      
    })

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

  isPossibleTimeout(): boolean {

    var msInHour = 1000 * 60 * 60;

    var created = new Date(this.submittedAction.createdAt).getTime();
    var durationPlusBuffer = this.submittedAction.duration * 1.25 + 4000; 

    // A little awkward - eliminates the possibility of server/client time
    // zone issues by focusing only on the ms relative to the begin of the hour
    var diff = Math.abs((created % msInHour) - (Date.now() % msInHour));

    console.log("Diff: ", diff, " | buffer : ", durationPlusBuffer);

    return diff > durationPlusBuffer;
  }

}
