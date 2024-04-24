import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamillePage } from './famille.page';

const routes: Routes = [
  {
    path: '',
    component: FamillePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FamillePageRoutingModule {}
