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
import { PlantDetailsComponent } from './plant-details/plant-details.component';
import { AddPlantCardComponent } from './dashboard/add-plant-card/add-plant-card.component';
import { FormsModule } from '@angular/forms';
import { PromptService } from './services/prompt.service';
import { SensorManagerComponent } from './plant-details/sensor-manager/sensor-manager.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HealthInputComponent } from './plant-details/health-input/health-input.component';
import { SensorRowComponent } from './dashboard/sensor-row/sensor-row.component';
import { library } from '@fortawesome/fontawesome-svg-core';

import { faPause, faPlay, faUnlink, faFlask, faLink , faTrashAlt, faEdit as fasEdit, faSave, faTimesCircle, faLeaf, faCaretDown, faCaretUp, faSyncAlt, faTimes, faPowerOff, faCloudShowersHeavy, faSun} from '@fortawesome/free-solid-svg-icons';
import { faPlayCircle, faPauseCircle, faQuestionCircle, faEdit } from '@fortawesome/free-regular-svg-icons';
import { AddSensorRowComponent } from './dashboard/add-sensor-row/add-sensor-row.component';
import { CustomIconComponent } from './helper/custom-icon/custom-icon.component';
import { FilenamePipe } from './pipes/filename.pipe';
import { WateringComponent } from './plant-details/watering/watering.component';
import { ScheduleService } from './services/schedule.service';

library.add(faQuestionCircle, faPause, faPlay, faPlayCircle, faPauseCircle, faTrashAlt, faUnlink, faFlask, faLink, faEdit, fasEdit, faSave, faTimesCircle, faLeaf, faCaretDown, faCaretUp, faSyncAlt, faTimes, faPowerOff, faCloudShowersHeavy, faSun);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PlantCardComponent,
    AlertComponent,
    PromptComponent,
    CookieManagerComponent,
    FooterComponent,
    PlantDetailsComponent,
    AddPlantCardComponent,
    SensorManagerComponent,
    HealthInputComponent,
    SensorRowComponent,
    AddSensorRowComponent,
    CustomIconComponent,
    FilenamePipe,
    WateringComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbPopoverModule,
    FormsModule,
    BrowserModule,
    FontAwesomeModule
  ],
  providers: [
    HttpOptionsService,
    PlantService,
    SensorService,
    MeasurementService,
    ActionService,
    AlertService,
    PromptService,
    ScheduleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
