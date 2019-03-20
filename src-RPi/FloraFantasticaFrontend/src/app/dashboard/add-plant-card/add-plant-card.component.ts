import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Plant } from 'src/app/models/plant.model';
import { PlantService } from 'src/app/services/plant.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-add-plant-card',
  templateUrl: './add-plant-card.component.html',
  styleUrls: ['./add-plant-card.component.scss']
})
export class AddPlantCardComponent implements OnInit {

  @Output( 'create') create = new EventEmitter<Plant>()
  @ViewChild('createPlantForm') createPlantForm : ElementRef;

  constructor(
    private plantService : PlantService,
    private alertService: AlertService
  ) { }

  showEdit: boolean = false;
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

  createPlant(e : MouseEvent){
    e.preventDefault();
    this.creating = true;
    var form : HTMLFormElement = this.createPlantForm.nativeElement;
    var data = new FormData(form);
    this.plantService.postPlantForm(data).subscribe(result => {
      this.create.emit(result);
      this.toggleEdit(false);
      this.creating = false;
    }, err => {
      this.alertService.warning("Plant API Error.",`Failed creating plant '${this.input.name}', please try again in a minute.`)
    })
  }

}
