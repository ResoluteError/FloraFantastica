import { Component, OnInit } from '@angular/core';
import { PlantService } from '../services/plant.service';
import { Plant } from '../models/plant.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private plantService : PlantService
  ) { }

  plants : Plant[] = null;

  ngOnInit() {

    this.plantService.getPlants().subscribe( plants => {

      this.plants = plants;

    }, err => {

      // Todo: Implement Alerts

    });

  }

}
