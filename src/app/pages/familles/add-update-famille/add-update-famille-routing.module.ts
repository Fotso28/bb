import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddUpdateFamillePage } from './add-update-famille.page';

const routes: Routes = [
  {
    path: '',
    component: AddUpdateFamillePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddUpdateFamillePageRoutingModule {}
