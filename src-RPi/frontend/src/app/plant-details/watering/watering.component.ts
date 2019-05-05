import { Component, OnInit, Input } from '@angular/core';
import { ActionService } from 'src/app/services/action.service';
import { Plant } from 'src/app/models/plant.model';
import { Action, ActionState } from 'src/app/models/action.model';
import { AlertService } from 'src/app/services/alert.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Schedule } from 'src/app/models/schedule.model';

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

  wateringSchedule : Schedule = null;

  lastWatered : Date;
  possibleTimeout : boolean = false;

  timeSelect : number = null;
  drySelect: number = null;
  lightSelect: number = null;
  scheduleActive : string | boolean = false;
  savingSchedule : boolean = false;

  constructor(
    private actionService : ActionService,
    private alertService : AlertService,
    private scheduleService: ScheduleService
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

    });

    this.scheduleService.getScheduleByPlantId( this.plant.id).subscribe( result => {
      if(!result){
        this.scheduleService.postSchedule({
          plantId: this.plant.id,
          active: false,
          valvePin: 38,
          duration: 45000,
          minDurationSinceWatering: 48
        }).subscribe( result => {
          this.wateringSchedule = result;
        }, err => {
          if(err.status == 403){
            this.alertService.accessDenied();
          } else {
          }
        });
      } else {

        this.wateringSchedule = result;

        this.scheduleActive = result.active;
        this.lightSelect = result.maxLight;
        this.timeSelect = result.minDurationSinceWatering;
        this.drySelect = result.minSoilDryness;
      }
    }, err => {
      console.log("error: ", err);
    })
  }


  updateSchedule(){
    
    this.wateringSchedule.active = this.scheduleActive == "true";
    this.wateringSchedule.maxLight = +this.lightSelect;
    this.wateringSchedule.minDurationSinceWatering = +this.timeSelect;
    this.wateringSchedule.minSoilDryness = +this.drySelect;
    this.savingSchedule = true;

    this.scheduleService.patchSchedule( this.wateringSchedule.id, this.wateringSchedule).subscribe( result => {
      this.alertService.success("Schedule updated!", "Your new rules are now in effect!");
    }, err => {
      if(err.status == 403){
        this.alertService.accessDenied();
      } else {
        this.alertService.warning("Schedule API Error!", "Failed saving the schedule, please try again in a moment.")
      }
    }, () => {
      this.savingSchedule = false;
    });

  }

  startWatering(){

    this.actionState = ActionState.queued;

    this.actionService.manualWatering(this.WATERING_VALVE_PIN, 1000 * +this.inputDuration, this.plant.id).subscribe( result => {
      
      console.log("Warning: Manual watering is still fixed to pin 38!");

      this.submittedAction = result;

      this.actionState = result.state;

      if(this.actionState === ActionState.queued){

        this.actionService.pingActionState(result.id).subscribe( result => {

          if(this.submittedAction && this.submittedAction.id === result.id){
            this.actionState = result.state;
            this.possibleTimeout = this.isPossibleTimeout();
          }

        }, err => {
          
          if(err.status == 403){
            this.alertService.accessDenied();
          } else {
            this.alertService.warning("Action API Error!", "Something went wrong, may be hardware related. Please check back later.");
          }
          

        });

    }

  }, err => {
    if (err.status == 403){
      this.alertService.accessDenied();
    } else {
      this.alertService.warning("Action API Error!", "Failed submitting action request, please try again in a moment.");
    }

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
      if (err.status == 403){
        this.alertService.accessDenied();
      } else {
        this.alertService.warning("Action API Error!", "Failed to cancel the action, please try again in a moment.")
      }
      
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
    var durationPlusBuffer = this.submittedAction.duration * 1.25 + 10000; 

    // A little awkward - eliminates the possibility of server/client time
    // zone issues by focusing only on the ms relative to the begin of the hour
    var diff = Math.abs((created % msInHour) - (Date.now() % msInHour));

    console.log("Diff: ", diff, " | buffer : ", durationPlusBuffer);

    return diff > durationPlusBuffer;
  }


}
