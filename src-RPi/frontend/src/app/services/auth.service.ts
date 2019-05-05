import { Injectable } from '@angular/core';
import { HttpOptionsService } from './http-options.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { reject } from 'q';
import { AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http : HttpClient,
    private httpOptions : HttpOptionsService
  ) { }

  login(pass : string): Observable<boolean>{

    var url = this.httpOptions.apiUrl;
    var options = this.httpOptions.options;
    
    return new Observable( observer => {

      this.http.post<AuthResponse>(`${url}/login`, {pass : pass}, options). subscribe( result => {

        if(result.key){
          localStorage.setItem("auth",result.key);
          observer.next(true);
        } else {
          localStorage.removeItem("auth");
          observer.next(false);
        }

      }, err => {
        localStorage.removeItem("auth");
        observer.error(err);
      }, () => {
        observer.complete();
      });

    });

  }

  // Boilerplate for changing this to a real request 
  // with potetial user management later
  logout(): Observable<boolean>{
    return new Observable( observer => {
      localStorage.removeItem("auth");
      observer.next(true);
      observer.complete();
    });
  }

}
