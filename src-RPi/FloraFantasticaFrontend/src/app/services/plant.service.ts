import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plant } from '../models/plant.model';
import { HttpOptionsService } from './http-options.service';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  constructor(
    private http : HttpClient,
    private httpOptions : HttpOptionsService
  ) { }


  getPlants(): Observable<Plant[]>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Plant[]>(url + "/plants", options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }

  getPlantById(id : string): Observable<Plant>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Plant>(url + "/plants/" + id, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }

  postPlant(plant: Partial<Plant>): Observable<Plant>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.post<Plant>(url + "/plants", plant, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }

  deletePlant(id : string): Observable<Plant>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.delete<Plant>(url + "/plants/" + id, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    })

  }

  patchPlant(id : string, patchedValues : Partial<Plant>) : Observable<Plant>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.patch<Plant>(url + "/plants/" + id, patchedValues, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    })

  }

}
