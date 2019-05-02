import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpOptionsService } from './http-options.service';
import { Plant } from '../models/plant.model';
import { Measurement } from '../models/measurement.model';
import { Sensor } from '../models/sensor.model';
import { Action, ActionState } from '../models/action.model';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(
    private http : HttpClient,
    private httpOptions : HttpOptionsService
  ) { }


  getActions(): Observable<Action[]>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {
      this.http.get<Action[]>(`${url}/actions`, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })
    });

  }

  getActionById(actionId : string): Observable<Action>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {
      this.http.get<Action>(`${url}/actions/${actionId}`, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })
    });

  }

  getActionsByPlantId(plantId : string): Observable<Action[]>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {
      this.http.get<Action[]>(`${url}/actions/plant/${plantId}`, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })
    });

  }


  getActionsByPlantIdAndState(plantId : string, state: number): Observable<Action[]>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {
      this.http.get<Action[]>(`${url}/actions/state/${state}/plant/${plantId}`, options).subscribe( result => {
        observer.next(result);
        observer.complete();
      }, err => {
        observer.error(err);
        observer.complete();
      })
    });

  }

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


  patchAction(actionId : string, action : Partial<Action>): Observable<Action>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {
      this.http.patch<Action>(`${url}/actions/${actionId}`, action, options).subscribe( result => {
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

  manualWatering( actionPin : number, duration : number, plantId : string) : Observable<Action>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {
      this.http.post<Action>(`${url}/actions/watering/pin/${actionPin}/duration/${duration}/plant/${plantId}`, {}, options).subscribe( result => {
        
        console.log("Watering Result: ", result);

        observer.next(result);
        observer.complete();

      }, err => {

        observer.error(err);
        observer.complete();
        console.log("Watering Error: ", err);

      });
    });
  };

  pingActionState( actionId : string): Observable<{state: ActionState}>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;

    return new Observable( observer => {

      var pingInterval = setInterval( () => {

        this.http.get<Action>(`${url}/actions/${actionId}`, options).subscribe( result => {

          if(result.state === -1){
            observer.error({state : result.state});
          }

          observer.next({state: result.state});

          if(result.state !== 1){
            observer.complete();
            clearInterval(pingInterval);
          }

        }, err => {

          observer.error(err);
          observer.complete();

        });

      }, 4000);

    });

  }


}
