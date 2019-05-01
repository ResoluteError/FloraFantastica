import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders } from '../../../node_modules/@angular/common/http';
import { HttpOptions } from '../models/httpOptions.model';

@Injectable({
  providedIn: 'root'
})
export class HttpOptionsService {

  constructor() { }

  get options(): HttpOptions {
    return {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json'
        })
    }
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
    return isDevMode() ? "http://localhost:8080" : "http://[2a02:908:4c16:23c0:e086:a928:cad6:8f1f]:8080";
  }

  get apiUrl(): string {
    return isDevMode() ? "http://localhost:8080/api" : "http://[2a02:908:4c16:23c0:e086:a928:cad6:8f1f]:8080/api";
  }


}
