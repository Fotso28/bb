import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PointVentePage } from './point-vente.page';

const routes: Routes = [
  {
    path: '',
    component: PointVentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PointVentePageRoutingModule {}
