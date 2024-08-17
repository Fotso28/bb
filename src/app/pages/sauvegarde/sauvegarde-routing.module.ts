import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SauvegardePage } from './sauvegarde.page';

const routes: Routes = [
  {
    path: '',
    component: SauvegardePage
  },
  {
    path: 'trigger-sauvegarde',
    loadChildren: () => import('./trigger-sauvegarde/trigger-sauvegarde.module').then( m => m.TriggerSauvegardePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SauvegardePageRoutingModule {}
