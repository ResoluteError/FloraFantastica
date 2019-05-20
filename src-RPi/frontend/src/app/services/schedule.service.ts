import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule } from '../models/schedule.model';
import { HttpOptionsService } from './http-options.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(
    private http : HttpClient,
    private httpOptions: HttpOptionsService
  ) { }

  getSchedules(): Observable<Schedule[]>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Schedule[]>(`${url}/schedules`, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })

    });

  }

  getScheduleById( scheduleId: string): Observable<Schedule>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Schedule>(`${url}/schedules/${scheduleId}`, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })

    });

  }

  getActiveSchedules(): Observable<Schedule[]>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Schedule[]>(`${url}/schedules/active`, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })

    });

  }

  getScheduleByPlantId(plantId: string): Observable<Schedule>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.get<Schedule>(`${url}/schedules/plant/${plantId}`, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })

    });

  }

  postSchedule(scheduleData : Partial<Schedule>): Observable<Schedule>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    console.log("Schedule Options: ", options);

    return new Observable( observer => {

      this.http.post<Schedule>(`${url}/schedules`, scheduleData, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })

    });
  }


  deleteSchedule( scheduleId: string): Observable<Schedule>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.delete<Schedule>(`${url}/schedules/${scheduleId}`, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })

    });

  }

  patchSchedule(scheduleId: string, scheduleData : Partial<Schedule>): Observable<Schedule>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      this.http.patch<Schedule>(`${url}/schedules/${scheduleId}`, scheduleData, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })

    });
  }

  // post, patch, delete missing

}
