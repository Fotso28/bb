import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RavitaillementFournisseurStepPage } from './ravitaillement-fournisseur-step.page';

const routes: Routes = [
  {
    path: '',
    component: RavitaillementFournisseurStepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RavitaillementFournisseurStepPageRoutingModule {}
