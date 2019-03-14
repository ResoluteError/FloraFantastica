import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpOptionsService } from './services/http-options.service';
import { PlantService } from './services/plant.service';
import { SensorService } from './services/sensor.service';
import { MeasurementService } from './services/measurement.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlantCardComponent } from './dashboard/plant-card/plant-card.component';
import { AlertComponent } from './helper/alert/alert.component';
import { PromptComponent } from './helper/prompt/prompt.component';
import { CookieManagerComponent } from './helper/cookie-manager/cookie-manager.component';
import { HttpClientModule } from '@angular/common/http';
import { ActionService } from './services/action.service';
import { FooterComponent } from './footer/footer.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from './services/alert.service';
import { HistoryComponent } from './history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PlantCardComponent,
    AlertComponent,
    PromptComponent,
    CookieManagerComponent,
    FooterComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbPopoverModule
  ],
  providers: [
    HttpOptionsService,
    PlantService,
    SensorService,
    MeasurementService,
    ActionService,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
