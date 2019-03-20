import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlantDetailsComponent } from './plant-details/plant-details.component';

const routes: Routes = [
  {
    path : '',
    component : DashboardComponent,
    data: {view: "plants"}
  },
  {
    path : 'sensors',
    component : DashboardComponent,
    data: {view: "sensors"}
  },
  {
    path : 'plant-details/:plantId',
    component : PlantDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
