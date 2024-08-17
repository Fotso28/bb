import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TriggerSauvegardePage } from './trigger-sauvegarde.page';

const routes: Routes = [
  {
    path: '',
    component: TriggerSauvegardePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TriggerSauvegardePageRoutingModule {}
