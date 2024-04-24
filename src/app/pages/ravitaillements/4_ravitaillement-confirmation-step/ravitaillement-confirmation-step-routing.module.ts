import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RavitaillementConfirmationStepPage } from './ravitaillement-confirmation-step.page';

const routes: Routes = [
  {
    path: '',
    component: RavitaillementConfirmationStepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RavitaillementConfirmationStepPageRoutingModule {}
