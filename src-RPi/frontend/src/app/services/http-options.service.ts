import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders } from '../../../node_modules/@angular/common/http';
import { HttpOptions } from '../models/httpOptions.model';

@Injectable({
  providedIn: 'root'
})
export class HttpOptionsService {

  constructor() { }

  get options(): HttpOptions {
    var result;
    if(localStorage.getItem("auth")){
      result = {
        headers: new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("auth")
          })
      }
    } else {
      result = {
        headers: new HttpHeaders(
          {
            'Content-Type': 'application/json'
          })
      }
    }
    return result;
  }

  get formOptions(): HttpOptions {
    return {
      headers: new HttpHeaders(
        {
          'Content-Type': 'multipart/form-data'
        })
    }
  }

  get url(): string {
    return isDevMode() ? "http://localhost:8080" : window.location.origin;
  }

  get apiUrl(): string {
    return isDevMode() ? "http://localhost:8080/api" : window.location.origin+"/api";
  }


}
