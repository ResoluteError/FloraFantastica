import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpOptionsService } from './http-options.service';
import { Plant } from '../models/plant.model';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(
    private http : HttpClient,
    private httpOptions : HttpOptionsService
  ) { }

  updatePlantCurrentData(plantId : string): Observable<Plant>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {
      this.http.post<Plant>(url + "/actions/plant/" + plantId + "/update-current-data", null, options).subscribe( updatedPlant => {
        observer.next(updatedPlant);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })
    });
  }
}
