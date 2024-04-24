import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddUpdateAvarisPage } from './add-update-avaris.page';

const routes: Routes = [
  {
    path: '',
    component: AddUpdateAvarisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddUpdateAvarisPageRoutingModule {}
