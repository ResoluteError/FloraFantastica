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
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';
import { ActionService } from './services/action.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PlantCardComponent,
    AlertComponent,
    PromptComponent,
    CookieManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    HttpOptionsService,
    PlantService,
    SensorService,
    MeasurementService,
    ActionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
