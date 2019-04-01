import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Prompt } from '../models/prompt.model';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  promptSubject : Subject<Prompt> = new Subject();

  constructor() { }

  getSubject(){
    return this.promptSubject;
  }

  confirmDelete(text : string, action: Function){
    this.promptSubject.next({
      title: "Confirm Delete",
      text: text,
      actions : [
        {
          text: "Delete",
          class: "danger",
          action: action
        },
        {
          text: "Cancel",
          class: "white",
          action: ()=>{}
        }
      ]
    })
  }

}
