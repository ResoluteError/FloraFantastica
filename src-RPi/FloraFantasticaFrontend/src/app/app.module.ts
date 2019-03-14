import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpOptionsService } from './services/http-options.service';
import { PlantService } from './services/plant.service';
import { SensorService } from './services/sensor.service';
import { MeasurementService } from './services/measurement.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    HttpOptionsService,
    PlantService,
    SensorService,
    MeasurementService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
