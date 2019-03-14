import { Injectable } from '@angular/core';
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

  get url(): string {
    return "http://localhost:8080";
  }


}
