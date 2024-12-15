import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeolocalizacionPage } from './geolocalizacion.page';

const routes: Routes = [
  {
    path: '',
    component: GeolocalizacionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeolocalizacionPageRoutingModule {}
