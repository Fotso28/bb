import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepensePage } from './depense.page';

const routes: Routes = [
  {
    path: '',
    component: DepensePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepensePageRoutingModule {}
