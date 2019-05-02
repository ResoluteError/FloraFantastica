import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { ActionService } from 'src/app/services/action.service';
import { Measurement } from 'src/app/models/measurement.model';
import { Plant } from 'src/app/models/plant.model';

@Component({
  selector: 'app-health-input',
  templateUrl: './health-input.component.html',
  styleUrls: ['./health-input.component.scss']
})
export class HealthInputComponent implements OnInit {

  @Output() postedHealth = new EventEmitter<Measurement>();
  @Input() plant: Plant;
  health: number = 5;
  entryAdded : boolean = false;
  posting : boolean = false;

  constructor(
    private alertService : AlertService,
    private actionService : ActionService
  ) { }

  ngOnInit() {
  }

  get healthClass(){
    if(this.health === 0){
      return "dark";
    } else if(this.health <= 3 ){
      return "danger"
    } else if(this.health <= 6 ){
      return "warning"
    } else {
      return "success"
    }
  }

  get healthDescription(){
    var states = [
      "I think it died! :(",
      "Almost dead",
      "Needs urgent attention",
      "Needs attention",
      "A little stressed",
      "Doing alright",
      "Slow growth",
      "Meeting expecatations",
      "Medium growth",
      "Rapid growth",
      "Perfect health! :)",
    ];
    return states[this.health];
  }

  postHealth(){
    this.posting = true;
    this.actionService.postHealthEntry(this.plant.id, this.health).subscribe( result => {
      this.alertService.success("Success.",`Added a new health entry for ${this.plant.name}`);
      this.entryAdded = true;
      this.postedHealth.emit(result);
      this.health = result.data;
    }, err => {
      this.alertService.warning("Action API Error.",`Failed to create a health entry for '${this.plant.name}', please try again in a moment.`);
      this.posting = false;
    })
  }

}
