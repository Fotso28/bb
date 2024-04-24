import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RavitaillementProduitStepPage } from './ravitaillement-produit-step.page';

const routes: Routes = [
  {
    path: '',
    component: RavitaillementProduitStepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RavitaillementProduitStepPageRoutingModule {}
