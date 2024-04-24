import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddUpdateDepensePage } from './add-update-depense.page';

const routes: Routes = [
  {
    path: '',
    component: AddUpdateDepensePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddUpdateDepensePageRoutingModule {}
