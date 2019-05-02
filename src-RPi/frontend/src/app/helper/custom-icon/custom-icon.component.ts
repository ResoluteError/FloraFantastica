import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-icon',
  templateUrl: './custom-icon.component.html',
  styleUrls: ['./custom-icon.component.scss']
})
export class CustomIconComponent implements OnInit {

  constructor() { }

  @Input() iconName : string;
  isFaIcon : boolean;
  faPrefix : string;
  faIcon : string;

  ngOnInit() {
    if(this.iconName.indexOf("fa") === 0){
      this.isFaIcon = true;
      var split = this.iconName.split("-");
      this.faPrefix = split.splice(0,1)[0];
      this.faIcon = split.join("-");
    }
  }

}
