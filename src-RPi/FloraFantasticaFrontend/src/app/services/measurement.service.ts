import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Measurement } from '../models/measurement.model';
import { HttpOptionsService } from './http-options.service';
@Injectable({
  providedIn: 'root'
})
export class MeasurementService {

  constructor(
    private http : HttpClient,
    private httpOptions : HttpOptionsService
  ) { }

  getMeasurements(): Observable<Measurement[]>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Measurement[]>(url + "/measurements", options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }

  getMeasurementById(id : number): Observable<Measurement>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Measurement>(url + "/measurements/"+id, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }

  postMeasurement(measurement : Partial<Measurement>): Observable<Measurement>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.post<Measurement>(url + "/measurements/", measurement, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }

  deleteMeasurement(id : number): Observable<Measurement>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.delete<Measurement>(url + "/measurements/"+id, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }

  getMeasurementsByPlantId(plantId : string): Observable<Measurement>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Measurement>(url + "/measurements/plant/"+plantId, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }
  getMeasurementsBySensorId(sensorId : string): Observable<Measurement[]>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Measurement[]>(url + "/measurements/sensor/" + sensorId, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }

  getMeasurementsBySensorIdAndPlantId(plantId : string, sensorId: string): Observable<Measurement[]>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Measurement[]>(url + "/measurements/sensor/" + sensorId + "/plant/"+ plantId, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }

  getMeasurementsBySensorTypeAndPlantId(plantId : string, sensorType: number): Observable<Measurement[]>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Measurement[]>(url + "/measurements/type/" + sensorType + "/plant/"+ plantId, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      });

    });

  }




}
