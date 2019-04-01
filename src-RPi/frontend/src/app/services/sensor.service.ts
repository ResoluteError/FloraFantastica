import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sensor } from '../models/sensor.model';
import { HttpOptionsService } from './http-options.service';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  constructor(
    private http : HttpClient,
    private httpOptions : HttpOptionsService
  ) { }

  getSensors(): Observable<Sensor[]>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Sensor[]>(url + "/sensors", options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }

  getSensorById(id : string): Observable<Sensor>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Sensor>(url + "/sensors/" + id, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }

  getAvailableSensors(): Observable<Sensor>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Sensor>(url + "/sensors/available", options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }
  


  getSensorsByPlantId(plantId : string): Observable<Sensor[]>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;
    
    return new Observable( observer => {

      this.http.get<Sensor[]>(url + "/plants/" + plantId + "/sensors", options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });
  }

  postSensor(Sensor: Partial<Sensor>): Observable<Sensor>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.post<Sensor>(url + "/sensors", Sensor, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }

  deleteSensor(id : string): Observable<Sensor>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.delete<Sensor>(url + "/sensors/" + id, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    })

  }

  patchSensor(id : string, patchedValues : Partial<Sensor>) : Observable<Sensor>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.patch<Sensor>(url + "/sensors/" + id, patchedValues, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    })

  }


}
