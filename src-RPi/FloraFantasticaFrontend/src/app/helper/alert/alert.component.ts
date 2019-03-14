import { Component, OnInit } from '@angular/core';
import { Alert } from '../../models/alert.model';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {


  alerts : Alert[] = [];

  constructor(
    private alertService : AlertService
  ) { }

  ngOnInit() {
    this.alertService.getSubject().subscribe( alert => {

      var duration = alert.duration || 3000;

      this.alerts.push({
        title: alert.title,
        text: alert.text,
        duration : duration,
        type: alert.type
      });

      setTimeout(_ => this.alerts.splice(0,1), duration || 3000);

    });
  }

}
