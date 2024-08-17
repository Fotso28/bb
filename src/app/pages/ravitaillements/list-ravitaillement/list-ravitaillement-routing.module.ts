import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListRavitaillementPage } from './list-ravitaillement.page';

const routes: Routes = [
  {
    path: '',
    component: ListRavitaillementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListRavitaillementPageRoutingModule {}
