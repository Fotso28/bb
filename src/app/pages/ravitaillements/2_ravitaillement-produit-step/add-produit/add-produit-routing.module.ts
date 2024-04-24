import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProduitPage } from './add-produit.page';

const routes: Routes = [
  {
    path: '',
    component: AddProduitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProduitPageRoutingModule {}
