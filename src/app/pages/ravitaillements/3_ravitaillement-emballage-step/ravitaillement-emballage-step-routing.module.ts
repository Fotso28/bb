import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RavitaillementEmballageStepPage } from './ravitaillement-emballage-step.page';

const routes: Routes = [
  {
    path: '',
    component: RavitaillementEmballageStepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RavitaillementEmballageStepPageRoutingModule {}
