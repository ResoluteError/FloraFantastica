import { Component, OnInit } from '@angular/core';
import { Plant } from 'src/app/models/plant.model';

@Component({
  selector: 'app-add-plant-card',
  templateUrl: './add-plant-card.component.html',
  styleUrls: ['./add-plant-card.component.scss']
})
export class AddPlantCardComponent implements OnInit {

  constructor() { }

  showEdit: boolean = true;
  creating : boolean = false;

  input = {
    name : "",
    imgSrc : ""
  }

  errors = {
    name : null,
    imgSrc : null
  }

  ngOnInit() {
  }

  toggleEdit(edit : boolean){
    this.showEdit = edit;
    if(!edit){
      this.input = {
        name : "",
        imgSrc : ""};
    }
  }

  createPlant(){
    this.creating = true;
    
  }

}
