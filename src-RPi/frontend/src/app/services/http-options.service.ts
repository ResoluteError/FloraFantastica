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
    return isDevMode() ? "http://localhost:8080" : "http://[2a02:908:4c18:a040:fa24:52c6:14f4:b676]:8080";
  }

  get apiUrl(): string {
    return isDevMode() ? "http://localhost:8080/api" : "http://[2a02:908:4c18:a040:fa24:52c6:14f4:b676]:8080/api";
  }


}
