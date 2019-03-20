import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PromptService } from 'src/app/services/prompt.service';
import { Prompt } from 'src/app/models/prompt.model';
declare var $ : any;

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {

  @ViewChild("promptModal") promptModal : ElementRef;

  constructor(
    private promptService: PromptService
  ) { }

  prompt : Partial<Prompt> = {};

  ngOnInit() {
    this.promptService.getSubject().subscribe( prompt => {
      this.prompt = prompt;
      $("#"+this.promptModal.nativeElement.id).modal('show');
    });
  }

  doAction( action : Function){
    $("#"+this.promptModal.nativeElement.id).modal('hide');
    action();
    setTimeout(() => {
      this.prompt = {};
    }, 300);

  }

}
