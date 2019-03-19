import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-health-input',
  templateUrl: './health-input.component.html',
  styleUrls: ['./health-input.component.scss']
})
export class HealthInputComponent implements OnInit {

  health: number = 5;
  entryAdded : boolean = false;

  constructor() { }

  ngOnInit() {
  }

  get healthClass(){
    if(this.health === 0){
      return "dark";
    } else if(this.health <= 3 ){
      return "danger"
    } else if(this.health <= 7 ){
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

}
