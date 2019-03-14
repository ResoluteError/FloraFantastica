import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Alert } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  alertSubject : Subject<Alert> = new Subject();

  getSubject(){
    return this.alertSubject;
  }

  success(title: string, text: string, duration?: number){
    this.alertSubject.next({
      title: title,
      text: text,
      duration: duration,
      type: "success"
    });
  }

  warning(title: string, text: string, duration?: number){
    this.alertSubject.next({
      title: title,
      text: text,
      duration: duration,
      type: "warning"
    });
  }

  danger(title: string, text: string, duration?: number){
    this.alertSubject.next({
      title: title,
      text: text,
      duration: duration,
      type: "danger"
    });
  }

}
