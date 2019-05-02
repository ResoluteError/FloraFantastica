import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpOptionsService } from './http-options.service';
import { Plant } from '../models/plant.model';
import { Measurement } from '../models/measurement.model';
import { Sensor } from '../models/sensor.model';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(
    private http : HttpClient,
    private httpOptions : HttpOptionsService
  ) { }

  getSensorMeasurement(sensorId: string): Observable<Measurement>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {
      this.http.post<Measurement>(url + "/actions/sensor/" + sensorId + "/measure", {}, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })
    });
  }

  checkSensorState( sensorId: string): Observable<Sensor>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {
      this.http.post<Sensor>(url + "/actions/sensor/" + sensorId + "/check", {}, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })
    });
  }

  postHealthEntry( plantId: string, health: number): Observable<Measurement>{
    
    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;
    
    return new Observable( observer => {
      this.http.post<Measurement>(`${url}/actions/plant/${plantId}/post-health-entry`,{data : health}, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });
  }

}
