import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FournisseurPage } from './fournisseur.page';

const routes: Routes = [
  {
    path: '',
    component: FournisseurPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FournisseurPageRoutingModule {}
